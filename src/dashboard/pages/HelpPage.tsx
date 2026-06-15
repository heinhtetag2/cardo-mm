import { useState } from 'react'
import { ChevronDown, BookOpen, MessageCircle, Mail, ArrowRight } from 'lucide-react'
import { FAQ_ENTRIES, HELP_LINKS } from '../data'

export function HelpPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 xl:px-12 py-6 sm:py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-[#1A1A1A]">Help & Support</h1>
        <p className="text-[13.5px] text-[#616161] mt-1">
          Guides, FAQs, and a real human in Yangon if you need one.
        </p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {HELP_LINKS.map((l, i) => (
          <button
            key={l.title}
            className="text-left bg-sand-0 border border-[#EBEBEB] rounded-2xl p-5 hover:border-[#5B8DEF]/40 transition group"
          >
            <div className={`w-10 h-10 rounded-xl grid place-items-center mb-4 ${i === 3 ? 'bg-[#FFF1EE] text-[#FF3C21]' : 'bg-[#EEF2FF] text-[#5B8DEF]'}`}>
              {i === 3 ? <Mail className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            </div>
            <div className="text-[14px] font-semibold text-[#1A1A1A]">{l.title}</div>
            <div className="text-[11.5px] text-[#616161] mt-1">{l.subtitle}</div>
            <div className="text-[11.5px] font-medium text-[#5B8DEF] mt-3 inline-flex items-center gap-1">
              Open
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-8">
        {/* FAQ */}
        <div className="lg:col-span-2 bg-sand-0 border border-[#EBEBEB] rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[#F3F3F3]">
            <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Frequently asked</h2>
            <p className="text-[11.5px] text-[#616161] mt-0.5">Most-asked questions from Yangon teams</p>
          </div>
          <ul>
            {FAQ_ENTRIES.map((f, i) => {
              const open = openIdx === i
              return (
                <li key={f.q} className="border-b border-[#F3F3F3] last:border-0">
                  <button
                    onClick={() => setOpenIdx(open ? null : i)}
                    className="w-full flex items-center justify-between gap-3 px-6 py-4 text-left hover:bg-[#FAFAFA] transition"
                  >
                    <span className="text-[13.5px] font-medium text-[#1A1A1A]">{f.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#616161] transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>
                  {open && (
                    <div className="px-6 pb-5 text-[12.5px] text-[#4A4A4A] leading-relaxed">
                      {f.a}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        {/* Contact card */}
        <div className="bg-gradient-to-br from-[#5B8DEF] to-[#8B5CF6] rounded-2xl p-6 text-sand-0">
          <div className="w-10 h-10 rounded-xl bg-sand-0/15 backdrop-blur grid place-items-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h2 className="text-[18px] font-semibold mt-4">Talk to a human</h2>
          <p className="text-[12.5px] opacity-90 mt-2">
            Swapo support is based in Yangon. We reply within one business day in English or မြန်မာဘာသာ.
          </p>
          <div className="mt-5 space-y-2.5 text-[12.5px]">
            <a className="flex items-center gap-2 opacity-90 hover:opacity-100 transition" href="mailto:hello@swapo.mm">
              <Mail className="w-3.5 h-3.5" /> hello@swapo.mm
            </a>
            <a className="flex items-center gap-2 opacity-90 hover:opacity-100 transition" href="#">
              <MessageCircle className="w-3.5 h-3.5" /> Chat with us (8a–8p MMT)
            </a>
          </div>
          <button className="mt-6 w-full h-11 bg-sand-0 text-[#5B8DEF] text-[13px] font-semibold rounded-xl hover:bg-sand-0/95 transition">
            Open a ticket
          </button>
        </div>
      </div>
    </div>
  )
}
