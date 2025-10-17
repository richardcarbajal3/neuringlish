export default function AnalysisBox({ analysis }: { analysis: any }) {
  if (!analysis) return null
  return (
    <section className="analysisBox">
      <h3>Análisis detallado</h3>
      <pre>{analysis.details}</pre>
      <style jsx>{`
        .analysisBox{margin-top:18px;padding:12px;border-radius:8px;border:1px solid #e6e6e6;background:#fff;}
        pre{white-space:pre-wrap;font-size:14px;}
      `}</style>
    </section>
  )
}
