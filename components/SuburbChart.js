'use client'
import { useEffect, useRef } from 'react'

export default function SuburbChart({ data }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    import('chart.js/auto').then(({ default: Chart }) => {
      if (chartRef.current) chartRef.current.destroy()
      chartRef.current = new Chart(canvasRef.current, {
        type: 'line',
        data: {
          labels: ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],
          datasets: [{
            data,
            borderColor: '#c9a84c',
            borderWidth: 1.5,
            fill: true,
            backgroundColor: 'rgba(201,168,76,0.07)',
            tension: 0.4,
            pointRadius: 0,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } },
          animation: { duration: 600 },
        }
      })
    })
    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [data])

  return (
    <div style={{ height: '56px', marginTop: '16px' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}
