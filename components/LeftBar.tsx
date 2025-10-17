type Analysis = {
  text: string
  words: number
  suggestion: string
  details?: string
} | null

export default function LeftBar({ analysis, onAdd, savedMsg }: { analysis: Analysis, onAdd: () => void, savedMsg: string }) {
  return (
    <aside className="leftbar">
      <h2>Barra izquierda</h2>
      {!analysis && <p>Analiza una oración para ver su gramática aquí.</p>}
      {analysis && (
        <>
          <div className="analysisSummary">
            <p><strong>Oración:</strong> {analysis.text}</p>
            <p><strong>Palabras:</strong> {analysis.words}</p>
            <p><strong>Sugerencia:</strong> {analysis.suggestion}</p>
          </div>
          <button className="addBtn" onClick={onAdd}>➕ Agregar a mi red</button>
          {savedMsg && <div className="savedMsg">{savedMsg}</div>}
        </>
      )}

      <style jsx>{`
        .leftbar {
          width:320px;
          padding:20px;
          border-right:1px solid #eee;
          background:#fafafa;
        }
        .analysisSummary p{margin:6px 0;font-size:14px;}
        .addBtn{margin-top:10px;padding:8px 10px;border-radius:6px;border:none;background:#0ea5a4;color:white;cursor:pointer;}
        .savedMsg{margin-top:8px;font-size:13px;color:#0b750f;}
        @media (max-width:768px){
          .leftbar{width:100%;order:2;opacity:0.95;}
        }
      `}</style>
    </aside>
  )
}
