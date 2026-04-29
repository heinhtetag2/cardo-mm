import { useState } from 'react'
import { Check, CreditCard, Sparkles, Zap, Receipt, Download, Star } from 'lucide-react'
import { PLANS, INVOICES, PAYMENT_METHODS, CURRENT_PLAN, DASH_STATS, type Plan } from '../data'

export function SubscriptionPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 xl:px-12 py-6 sm:py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-[#1A1A1A]">Subscription</h1>
          <p className="text-[13.5px] text-[#616161] mt-1">
            Manage your plan, payment, and Cardo Pro benefits.
          </p>
        </div>
      </div>

      {/* Current plan + usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#5B8DEF] to-[#8B5CF6] rounded-2xl p-7 text-white relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/10" />
          <div className="absolute top-16 right-24 w-24 h-24 rounded-full bg-white/5" />
          <div className="relative">
            <div className="flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-wider opacity-80">
              <Star className="w-3.5 h-3.5" /> Current plan
            </div>
            <div className="text-[34px] font-bold mt-1.5 leading-none">Cardo Pro</div>
            <p className="text-[13px] opacity-90 mt-2.5">
              You're on the monthly plan · 9,900 MMK · billed via KBZPay
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-7">
              <UsageMeter label="AI credits" value={DASH_STATS.aiCreditsLeft} max={DASH_STATS.aiCreditsCap} unit="left" />
              <UsageMeter label="Cards" value={DASH_STATS.cardsCount} max={5} unit="of 5" />
              <UsageMeter label="Saved contacts" value={DASH_STATS.savedContacts} max={Infinity} unit="unlimited" />
            </div>
            <div className="mt-7 flex items-center gap-2 flex-wrap">
              <button className="h-10 px-4 inline-flex items-center gap-1.5 bg-white text-[#5B8DEF] text-[12.5px] font-semibold rounded-xl hover:bg-white/95 transition">
                <Zap className="w-3.5 h-3.5" /> Upgrade to Business
              </button>
              <button className="h-10 px-4 inline-flex items-center gap-1.5 bg-white/15 text-white text-[12.5px] font-medium rounded-xl hover:bg-white/25 backdrop-blur transition">
                Switch to yearly · save 17%
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6">
          <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Billing</h2>
          <p className="text-[11.5px] text-[#616161] mt-0.5 mb-5">Next charge · 1 May 2026</p>
          <div className="space-y-3.5">
            <Row label="Plan" value="Cardo Pro · monthly" />
            <Row label="Amount" value="9,900 MMK" />
            <Row label="Method" value="KBZPay · 0978" />
          </div>
          <button className="mt-5 w-full h-10 inline-flex items-center justify-center gap-1.5 bg-[#F8F8F8] hover:bg-[#F3F3F3] rounded-xl text-[12.5px] font-medium text-[#1A1A1A] transition">
            <CreditCard className="w-3.5 h-3.5" />
            Manage payment
          </button>
        </div>
      </div>

      {/* Plan picker */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-[18px] font-semibold text-[#1A1A1A]">Plans</h2>
          <p className="text-[12px] text-[#616161] mt-0.5">Choose what fits your network</p>
        </div>
        <div className="inline-flex bg-[#F3F3F3] rounded-2xl p-1">
          <button
            onClick={() => setBilling('monthly')}
            className={`h-9 px-4 text-[12px] font-medium rounded-xl transition ${billing === 'monthly' ? 'bg-white shadow text-[#1A1A1A]' : 'text-[#616161]'}`}
          >Monthly</button>
          <button
            onClick={() => setBilling('yearly')}
            className={`h-9 px-4 text-[12px] font-medium rounded-xl transition ${billing === 'yearly' ? 'bg-white shadow text-[#1A1A1A]' : 'text-[#616161]'}`}
          >Yearly · save 17%</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {PLANS.map((p) => <PlanCard key={p.id} plan={p} billing={billing} active={p.id === CURRENT_PLAN} />)}
      </div>

      {/* Two-up: invoices + payment methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
        <div className="lg:col-span-2 bg-white border border-[#EBEBEB] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F3F3F3] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-3.5 h-3.5 text-[#5B8DEF]" />
              <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Billing history</h2>
            </div>
            <button className="text-[11.5px] font-medium text-[#5B8DEF] hover:text-[#4A7AD9] transition">Download CSV</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-[#616161]">
                <th className="text-left px-6 py-3">Invoice</th>
                <th className="text-left px-6 py-3 hidden sm:table-cell">Method</th>
                <th className="text-right px-6 py-3">Amount</th>
                <th className="text-right px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F3F3]">
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="text-[13px] hover:bg-[#FAFAFA] transition">
                  <td className="px-6 py-3.5">
                    <div className="font-medium text-[#1A1A1A]">{inv.description}</div>
                    <div className="text-[11px] text-[#616161]">{inv.id} · {formatDate(inv.date)}</div>
                  </td>
                  <td className="px-6 py-3.5 hidden sm:table-cell text-[#1A1A1A]">{inv.method}</td>
                  <td className="px-6 py-3.5 text-right tabular-nums font-medium text-[#1A1A1A]">{inv.amount.toLocaleString()} MMK</td>
                  <td className="px-6 py-3.5 text-right">
                    <button className="text-[#616161] hover:text-[#5B8DEF] transition">
                      <Download className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-[#EBEBEB] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F3F3F3]">
            <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Payment methods</h2>
            <p className="text-[11.5px] text-[#616161] mt-0.5">Local & international</p>
          </div>
          <ul className="divide-y divide-[#F3F3F3]">
            {PAYMENT_METHODS.map((m) => (
              <li key={m.name} className="flex items-center gap-3 px-6 py-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F8F8F8] grid place-items-center text-[12.5px] font-bold text-[#1A1A1A]">
                  {paymentBadge(m.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[#1A1A1A]">{m.name}</div>
                  <div className="text-[11px] text-[#616161] truncate">{m.subtitle}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function PlanCard({ plan, billing, active }: { plan: Plan; billing: 'monthly' | 'yearly'; active: boolean }) {
  const price = billing === 'monthly' ? plan.pricePerMonth : Math.round(plan.pricePerYear / 12)
  return (
    <div
      className={`relative bg-white rounded-2xl p-6 flex flex-col transition ${
        plan.highlight ? 'border-2 border-[#5B8DEF] shadow-md' : 'border border-[#EBEBEB]'
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-2.5 left-6 bg-gradient-to-r from-[#5B8DEF] to-[#8B5CF6] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
          {plan.badge}
        </span>
      )}
      <div className="flex items-center justify-between">
        <div className="text-[16px] font-semibold text-[#1A1A1A]">{plan.name}</div>
        {active && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#ECFDF5] text-[#047857]">Current</span>}
      </div>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="text-[34px] font-bold tabular-nums text-[#1A1A1A] leading-none">
          {price === 0 ? 'Free' : price.toLocaleString()}
        </span>
        {price > 0 && <span className="text-[12px] text-[#616161]">MMK / month</span>}
      </div>
      {billing === 'yearly' && plan.pricePerYear > 0 && (
        <div className="text-[10.5px] text-[#5B8DEF] font-medium mt-1">
          Billed yearly: {plan.pricePerYear.toLocaleString()} MMK
        </div>
      )}

      <ul className="mt-5 space-y-2.5 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-[12.5px] text-[#1A1A1A]">
            <Check className="w-3.5 h-3.5 text-[#5B8DEF] mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <button
        disabled={active}
        className={`mt-6 h-11 inline-flex items-center justify-center gap-2 text-[13px] font-semibold rounded-xl transition ${
          active
            ? 'bg-[#F3F3F3] text-[#9A9A9A] cursor-default'
            : plan.highlight
            ? 'bg-gradient-to-r from-[#5B8DEF] to-[#8B5CF6] text-white hover:opacity-95 shadow-sm'
            : 'bg-[#1A1A1A] text-white hover:bg-[#303030]'
        }`}
      >
        {active ? 'Current plan' : plan.id === 'free' ? 'Downgrade' : (
          <>
            <Sparkles className="w-3.5 h-3.5" /> {plan.id === 'pro' ? 'Switch to Pro' : 'Upgrade'}
          </>
        )}
      </button>
    </div>
  )
}

function UsageMeter({ label, value, max, unit }: { label: string; value: number; max: number; unit: string }) {
  const pct = Number.isFinite(max) ? (value / max) * 100 : 100
  return (
    <div>
      <div className="flex items-baseline justify-between text-[11px]">
        <span className="opacity-80">{label}</span>
        <span className="tabular-nums opacity-90">
          {value} <span className="opacity-70">{unit}</span>
        </span>
      </div>
      <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden mt-1.5">
        <div className="h-full bg-white" style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[12.5px]">
      <span className="text-[#616161]">{label}</span>
      <span className="font-medium text-[#1A1A1A]">{value}</span>
    </div>
  )
}

function paymentBadge(name: string): string {
  switch (name) {
    case 'KBZPay': return 'KP'
    case 'Wave Pay': return 'W'
    case 'AYA Pay': return 'AYA'
    case 'Card': return 'CC'
    case 'Bank transfer': return 'BT'
    default: return '·'
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}
