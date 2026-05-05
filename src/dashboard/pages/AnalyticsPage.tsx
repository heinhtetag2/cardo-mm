import { useMemo, useState } from 'react'
import { ArrowUpRight, ArrowDownRight, Calendar, ChevronDown, MapPin, Smartphone, Layers } from 'lucide-react'
import { AreaChart } from '../AreaChart'
import {
  RANGE_OPTIONS, getRangeData, CITY_SCANS, SOURCE_BREAKDOWN, DEVICE_BREAKDOWN, TOP_CARDS_PERF, HOURLY_PATTERN,
  type DashRange,
} from '../data'

export function AnalyticsPage() {
  const [range, setRange] = useState<DashRange>('30d')
  const data = useMemo(() => getRangeData(range), [range])

  const hourlyMax = Math.max(...HOURLY_PATTERN.map((h) => h.value))

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 xl:px-12 py-6 sm:py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-[#1A1A1A]">Analytics</h1>
          <p className="text-[13.5px] text-[#616161] mt-1">
            Where, when, and how your cards are scanned across Myanmar.
          </p>
        </div>
        <RangeSelect value={range} onChange={setRange} />
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi title="Total scans" value="1,432" delta={12.4} positive />
        <Kpi title="Save rate" value="16.7%" delta={2.1} positive />
        <Kpi title="Unique scanners" value="1,089" delta={8.7} positive />
        <Kpi title="Avg / day" value="47.7" delta={-3.2} positive={false} />
      </div>

      {/* Big chart */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 sm:p-7 mb-6">
        <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Network growth</h2>
            <p className="text-[11.5px] text-[#616161] mt-0.5">
              New saves {RANGE_OPTIONS.find((o) => o.value === range)?.label.toLowerCase()}
            </p>
            <div className="flex items-baseline gap-2 mt-2.5">
              <div className="text-[34px] font-bold tabular-nums leading-none">+{data.total}</div>
              <div className={`text-[11.5px] font-medium flex items-center gap-0.5 ${data.trend >= 0 ? 'text-[#047857]' : 'text-[#DC2626]'}`}>
                {data.trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(data.trend).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
        <AreaChart points={data.points} height={220} />
      </div>

      {/* Two-up: cities + sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Panel title="Scans by city" subtitle="Top 6 areas" icon={MapPin}>
          <ul className="space-y-3.5">
            {CITY_SCANS.map((c) => (
              <li key={c.city}>
                <div className="flex items-center justify-between mb-1.5 text-[12px]">
                  <span className="font-medium text-[#1A1A1A]">{c.city}</span>
                  <span className="text-[#616161] tabular-nums">{c.count} · {c.pct}%</span>
                </div>
                <div className="h-2 w-full bg-[#F3F3F3] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#5B8DEF] to-[#8B5CF6] rounded-full" style={{ width: `${c.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="How they scanned" subtitle="Source breakdown" icon={Layers}>
          <ul className="space-y-3.5">
            {SOURCE_BREAKDOWN.map((s) => (
              <li key={s.source}>
                <div className="flex items-center justify-between mb-1.5 text-[12px]">
                  <span className="font-medium text-[#1A1A1A]">{s.source}</span>
                  <span className="text-[#616161] tabular-nums">{s.count} · {s.pct}%</span>
                </div>
                <div className="h-2 w-full bg-[#F3F3F3] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#10B981] to-[#5B8DEF] rounded-full" style={{ width: `${s.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Two-up: hourly pattern + device */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white border border-[#EBEBEB] rounded-2xl p-6">
          <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Best time to share</h2>
          <p className="text-[11.5px] text-[#616161] mt-0.5 mb-5">When most scans happen (Yangon time)</p>
          <div className="flex items-end gap-2 h-40">
            {HOURLY_PATTERN.map((h) => {
              const pct = (h.value / hourlyMax) * 100
              return (
                <div key={h.hour} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex-1 flex items-end">
                    <div className="w-full rounded-t-lg bg-gradient-to-t from-[#5B8DEF] to-[#8B5CF6]" style={{ height: `${pct}%` }} />
                  </div>
                  <span className="text-[10.5px] text-[#616161]">{h.hour}</span>
                </div>
              )
            })}
          </div>
        </div>

        <Panel title="Device" subtitle="Visitor split" icon={Smartphone}>
          <ul className="space-y-3.5">
            {DEVICE_BREAKDOWN.map((d) => (
              <li key={d.device}>
                <div className="flex items-center justify-between mb-1.5 text-[12px]">
                  <span className="font-medium text-[#1A1A1A]">{d.device}</span>
                  <span className="text-[#616161] tabular-nums">{d.pct}%</span>
                </div>
                <div className="h-2 w-full bg-[#F3F3F3] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#F472B6] rounded-full" style={{ width: `${d.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Top performing cards */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl overflow-hidden pb-2">
        <div className="px-6 py-5 border-b border-[#F3F3F3] flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Top performing cards</h2>
            <p className="text-[11.5px] text-[#616161] mt-0.5">Ranked by save rate</p>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-[11px] font-semibold uppercase tracking-wider text-[#616161]">
              <th className="text-left px-6 py-3">Card</th>
              <th className="text-right px-6 py-3 hidden sm:table-cell">Scans</th>
              <th className="text-right px-6 py-3 hidden sm:table-cell">Saves</th>
              <th className="text-right px-6 py-3">Save rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F3F3]">
            {TOP_CARDS_PERF.map((row) => (
              <tr key={row.card} className="text-[13px] hover:bg-[#FAFAFA] transition">
                <td className="px-6 py-3.5 font-medium text-[#1A1A1A]">{row.card}</td>
                <td className="px-6 py-3.5 text-right tabular-nums text-[#1A1A1A] hidden sm:table-cell">{row.scans}</td>
                <td className="px-6 py-3.5 text-right tabular-nums text-[#1A1A1A] hidden sm:table-cell">{row.saves}</td>
                <td className="px-6 py-3.5 text-right tabular-nums font-semibold text-[#5B8DEF]">{row.saveRate.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Kpi({ title, value, delta, positive }: { title: string; value: string; delta: number; positive: boolean }) {
  return (
    <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6">
      <div className="text-[12px] font-medium text-[#616161]">{title}</div>
      <div className="text-[34px] font-bold tabular-nums text-[#1A1A1A] mt-2.5 leading-none">{value}</div>
      <div className={`text-[11px] font-medium flex items-center gap-0.5 mt-2.5 ${positive ? 'text-[#047857]' : 'text-[#DC2626]'}`}>
        {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {Math.abs(delta).toFixed(1)}% vs last period
      </div>
    </div>
  )
}

function Panel({ title, subtitle, icon: Icon, children }: { title: string; subtitle: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 text-[#5B8DEF]" />
        <h2 className="text-[16px] font-semibold text-[#1A1A1A]">{title}</h2>
      </div>
      <p className="text-[11.5px] text-[#616161] mb-4">{subtitle}</p>
      {children}
    </div>
  )
}

function RangeSelect({ value, onChange }: { value: DashRange; onChange: (v: DashRange) => void }) {
  const [open, setOpen] = useState(false)
  const current = RANGE_OPTIONS.find((o) => o.value === value)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-11 px-4 inline-flex items-center gap-2 bg-white border border-[#EBEBEB] rounded-xl text-[12.5px] font-medium text-[#1A1A1A] hover:bg-[#FAFAFA] transition"
      >
        <Calendar className="w-3.5 h-3.5 text-[#616161]" />
        {current?.label}
        <ChevronDown className="w-3.5 h-3.5 text-[#616161]" />
      </button>
      {open && (
        <>
          <button onClick={() => setOpen(false)} className="fixed inset-0 z-10 cursor-default" aria-hidden />
          <div className="absolute right-0 top-full mt-1.5 z-20 w-44 bg-white border border-[#EBEBEB] rounded-xl shadow-lg p-1.5">
            {RANGE_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => { onChange(o.value); setOpen(false) }}
                className={`w-full px-3 py-2 text-left text-[12.5px] rounded-lg transition ${value === o.value ? 'bg-[#EEF2FF] text-[#5B8DEF] font-semibold' : 'text-[#303030] hover:bg-[#F3F3F3]'}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
