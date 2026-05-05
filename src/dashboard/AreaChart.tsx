type Pt = { value: number; label: string }

export function AreaChart({ points, height = 240 }: { points: Pt[]; height?: number }) {
  if (points.length === 0) return null
  const w = 800
  const h = height
  const padTop = 16
  const padBottom = 32
  const padLeft = 32
  const padRight = 16
  const innerW = w - padLeft - padRight
  const innerH = h - padTop - padBottom

  const max = Math.max(...points.map((p) => p.value), 1)
  const niceMax = Math.ceil(max * 1.15)
  const avg = points.reduce((s, p) => s + p.value, 0) / points.length

  const stepX = points.length > 1 ? innerW / (points.length - 1) : innerW
  const xy = points.map((p, i) => {
    const x = padLeft + i * stepX
    const y = padTop + innerH - (p.value / niceMax) * innerH
    return { x, y, p }
  })

  const linePath = xy.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ')
  const areaPath = `${linePath} L ${xy[xy.length - 1].x} ${padTop + innerH} L ${xy[0].x} ${padTop + innerH} Z`

  const yTicks = 4
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((niceMax / yTicks) * i))
  const avgY = padTop + innerH - (avg / niceMax) * innerH

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="swapoArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5B8DEF" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#5B8DEF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Y-axis labels & gridlines */}
      {ticks.map((t, i) => {
        const y = padTop + innerH - (innerH * i) / yTicks
        return (
          <g key={i}>
            <line x1={padLeft} y1={y} x2={w - padRight} y2={y} stroke="#F3F3F3" strokeDasharray="3 3" />
            <text x={padLeft - 6} y={y + 4} fontSize="11" textAnchor="end" fill="#616161">
              {t}
            </text>
          </g>
        )
      })}

      {/* Average reference line */}
      {avg > 0 && (
        <g>
          <line x1={padLeft} y1={avgY} x2={w - padRight} y2={avgY} stroke="#8A8A8A" strokeDasharray="4 4" />
          <text x={w - padRight} y={avgY - 4} fontSize="11" textAnchor="end" fill="#616161">
            Avg {avg.toFixed(1)}
          </text>
        </g>
      )}

      {/* Area fill + line */}
      <path d={areaPath} fill="url(#swapoArea)" />
      <path d={linePath} fill="none" stroke="#5B8DEF" strokeWidth="2" />

      {/* Dots */}
      {xy.map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#fff" stroke="#5B8DEF" strokeWidth="2" />
      ))}

      {/* X-axis labels */}
      {xy.map((pt, i) => (
        <text key={i} x={pt.x} y={h - 8} fontSize="11" textAnchor="middle" fill="#616161">
          {pt.p.label}
        </text>
      ))}
    </svg>
  )
}
