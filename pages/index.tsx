import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import LeftBar from '../components/LeftBar'
import AnalysisBox from '../components/AnalysisBox'

type Analysis = {
  text: string
  words: number
  suggestion: string
  details?: string
} | null

export default function Home() {
  const [sentence, setSentence] = useState('')
  const [analysis, setAnalysis] = useState<Analysis>(null)
  const [loading, setLoading] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  const runGrammarAnalysis = (text: string): Analysis => {
    if (!text || text.trim().length === 0) return null
    const words = text.trim().split(/\s+/).length
    const suggestion = text.trim().endsWith('.') ? 'Punctuation looks ok.' : 'Consider adding punctuation.'
    return {
      text,
      words,
      suggestion,
      details: `La oración tiene ${words} palabra(s). ${suggestion}`
    }
  }

  const handleAnalyze = () => {
    setLoading(true)
    setTimeout(() => {
      setAnalysis(runGrammarAnalysis(sentence))
      setLoading(false)
    }, 300)
  }

  const addToNetwork = async () => {
    if (!analysis) return
    setSavedMsg('Guardando...')
    const { data, error } = await supabase
      .from('sentences')
      .insert([{ sentence: analysis.text, analysis: JSON.stringify(analysis) }])
      .select()
    if (error) {
      console.error(error)
      setSavedMsg('Error guardando. Revisa consola.')
    } else {
      setSavedMsg('Guardado en tu red ✔️')
      setTimeout(() => setSavedMsg(''), 2500)
    }
  }

  const [recent, setRecent] = useState<any[]>([])
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('sentences')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      if (!error) setRecent(data || [])
    }
    load()
  }, [savedMsg])

  return (
    <div className="page">
      <LeftBar analysis={analysis} onAdd={addToNetwork} savedMsg={savedMsg} />
      <main className="main">
        <h1 className="title">NeurEnglish — MVP (TypeScript)</h1>

        <section className="inputSection">
          <textarea
            placeholder="Escribe una oración aquí..."
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            rows={4}
          />
          <div className="controls">
            <button onClick={handleAnalyze} disabled={loading}>
              {loading ? 'Analizando...' : 'Analizar'}
            </button>
          </div>
        </section>

        <AnalysisBox analysis={analysis} />

        <section className="recent">
          <h3>Guardadas (últimas 5)</h3>
          <ul>
            {recent.map((r) => (
              <li key={r.id}>
                <strong>{r.sentence}</strong>
                <div className="meta">{new Date(r.created_at).toLocaleString()}</div>
              </li>
            ))}
            {recent.length === 0 && <li>No hay oraciones guardadas aún.</li>}
          </ul>
        </section>
      </main>

      <style jsx>{`
        .page{display:flex; min-height:100vh; font-family:Inter,system-ui,Arial;}
        .main{flex:1;padding:32px; max-width:900px;}
        .title{font-size:24px;margin-bottom:12px;}
        .inputSection textarea{width:100%; padding:12px; font-size:16px; border:1px solid #ddd; border-radius:6px;}
        .controls{margin-top:8px;}
        button{background:#111827;color:white;padding:8px 12px;border-radius:6px;border:none;cursor:pointer;}
        .recent ul{list-style:none;padding:0;margin-top:12px;}
        .recent li{padding:8px 0;border-bottom:1px solid #eee;}
        .meta{font-size:12px;color:#666;}
        @media (max-width:768px){
          .page{flex-direction:column;}
        }
      `}</style>
    </div>
  )
}
