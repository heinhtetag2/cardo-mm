import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ChevronLeft, ChevronDown, Sparkles, Camera, Bell, Radar, Check,
  User, Briefcase, Building2, Mail, X, Search, Phone, Wand2,
} from 'lucide-react'
import { InputRow } from '../components/InputRow'
import { LocationPicker, LocationPickerRow } from '../components/LocationPicker'
import { WebsiteRow } from '../components/WebsiteRow'
import { useT } from '../i18n'

type Country = { code: string; name: string; flag: string; dial: string }

const countries: Country[] = [
  { code: 'MM', name: 'Myanmar',              flag: '🇲🇲', dial: '95'  },
  { code: 'TH', name: 'Thailand',             flag: '🇹🇭', dial: '66'  },
  { code: 'SG', name: 'Singapore',            flag: '🇸🇬', dial: '65'  },
  { code: 'MY', name: 'Malaysia',             flag: '🇲🇾', dial: '60'  },
  { code: 'ID', name: 'Indonesia',            flag: '🇮🇩', dial: '62'  },
  { code: 'PH', name: 'Philippines',          flag: '🇵🇭', dial: '63'  },
  { code: 'VN', name: 'Vietnam',              flag: '🇻🇳', dial: '84'  },
  { code: 'CN', name: 'China',                flag: '🇨🇳', dial: '86'  },
  { code: 'HK', name: 'Hong Kong',            flag: '🇭🇰', dial: '852' },
  { code: 'TW', name: 'Taiwan',               flag: '🇹🇼', dial: '886' },
  { code: 'JP', name: 'Japan',                flag: '🇯🇵', dial: '81'  },
  { code: 'KR', name: 'South Korea',          flag: '🇰🇷', dial: '82'  },
  { code: 'IN', name: 'India',                flag: '🇮🇳', dial: '91'  },
  { code: 'BD', name: 'Bangladesh',           flag: '🇧🇩', dial: '880' },
  { code: 'AU', name: 'Australia',            flag: '🇦🇺', dial: '61'  },
  { code: 'NZ', name: 'New Zealand',          flag: '🇳🇿', dial: '64'  },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dial: '971' },
  { code: 'SA', name: 'Saudi Arabia',         flag: '🇸🇦', dial: '966' },
  { code: 'US', name: 'United States',        flag: '🇺🇸', dial: '1'   },
  { code: 'CA', name: 'Canada',               flag: '🇨🇦', dial: '1'   },
  { code: 'GB', name: 'United Kingdom',       flag: '🇬🇧', dial: '44'  },
  { code: 'DE', name: 'Germany',              flag: '🇩🇪', dial: '49'  },
  { code: 'FR', name: 'France',               flag: '🇫🇷', dial: '33'  },
]

type Step =
  | 'welcome'
  | 'feat'
  | 'phone'
  | 'otp'
  | 'profile'
  | 'permissions'
  | 'done'

export type OnboardingData = {
  phone?: string
  name?: string
  role?: string
  company?: string
  city?: string
  email?: string
  website?: string
  bio?: string
  notifications?: boolean
  nearby?: boolean
}

type Slide = { eyebrow: string; title: string; body: string }

export function OnboardingScreen({
  onDone,
}: {
  onDone: (info: OnboardingData) => void
}) {
  const t = useT()
  const slides: Slide[] = [
    { eyebrow: t('onb.feat.s1.eyebrow'), title: t('onb.feat.s1.title'), body: t('onb.feat.s1.body') },
    { eyebrow: t('onb.feat.s2.eyebrow'), title: t('onb.feat.s2.title'), body: t('onb.feat.s2.body') },
    { eyebrow: t('onb.feat.s3.eyebrow'), title: t('onb.feat.s3.title'), body: t('onb.feat.s3.body') },
  ]
  const [step, setStep] = useState<Step>('welcome')
  const [slide, setSlide] = useState(0)
  const [isSignIn, setIsSignIn] = useState(false)
  const totalSlides = slides.length

  const [country, setCountry] = useState<Country>(countries[0])
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [city, setCity] = useState<string>('Yangon')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [bio, setBio] = useState('')
  const [notifOn, setNotifOn] = useState(true)
  const [nearbyOn, setNearbyOn] = useState(true)

  const data: OnboardingData = {
    phone: phone.trim() ? `+${country.dial} ${phone.trim()}` : undefined,
    name: name.trim() || undefined,
    role: role.trim() || undefined,
    company: company.trim() || undefined,
    city: city.trim() || undefined,
    email: email.trim() || undefined,
    website: website.trim() || undefined,
    bio: bio.trim() || undefined,
    notifications: notifOn,
    nearby: nearbyOn,
  }

  const next = () => {
    if (step === 'welcome') return setStep('feat')
    if (step === 'feat') {
      if (slide < totalSlides - 1) return setSlide(slide + 1)
      return setStep('phone')
    }
    if (step === 'phone') return setStep('otp')
    if (step === 'otp') {
      if (isSignIn) return onDone(data)
      return setStep('profile')
    }
    if (step === 'profile') return setStep('permissions')
    if (step === 'permissions') return setStep('done')
    onDone(data)
  }

  const back = () => {
    if (step === 'feat') {
      if (slide > 0) return setSlide(slide - 1)
      return setStep('welcome')
    }
    if (step === 'phone') {
      if (isSignIn) { setIsSignIn(false); return setStep('welcome') }
      setSlide(totalSlides - 1)
      return setStep('feat')
    }
    if (step === 'otp') return setStep('phone')
    if (step === 'profile') return setStep('otp')
    if (step === 'permissions') return setStep('profile')
    if (step === 'done') return setStep('permissions')
  }

  return (
    <div className="relative h-full w-full bg-canvas flex flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-glow-radial" />

      {step === 'welcome' && (
        <Welcome onContinue={next} onSignIn={() => { setIsSignIn(true); setStep('phone') }} />
      )}

      {step === 'feat' && (
        <Features
          slides={slides}
          slide={slide}
          total={totalSlides}
          onBack={back}
          onSkip={() => setStep('phone')}
          onNext={next}
        />
      )}

      {step === 'phone' && (
        <PhonePane
          country={country} setCountry={setCountry}
          phone={phone} setPhone={setPhone}
          onBack={back} onNext={next}
          isSignIn={isSignIn}
        />
      )}

      {step === 'otp' && (
        <OtpPane
          country={country}
          phone={phone} otp={otp} setOtp={setOtp}
          onBack={back} onNext={next}
        />
      )}

      {step === 'profile' && (
        <ProfilePane
          country={country}
          name={name} setName={setName}
          role={role} setRole={setRole}
          company={company} setCompany={setCompany}
          city={city} setCity={setCity}
          phone={phone} setPhone={setPhone}
          email={email} setEmail={setEmail}
          website={website} setWebsite={setWebsite}
          bio={bio} setBio={setBio}
          onBack={back} onNext={next}
        />
      )}

      {step === 'permissions' && (
        <PermissionsPane
          notifOn={notifOn} setNotifOn={setNotifOn}
          nearbyOn={nearbyOn} setNearbyOn={setNearbyOn}
          onBack={back} onNext={next}
        />
      )}

      {step === 'done' && (
        <DonePane data={data} onBack={back} onEnter={() => onDone(data)} />
      )}
    </div>
  )
}

/* ───────── Welcome ───────── */

function Welcome({ onContinue, onSignIn }: { onContinue: () => void; onSignIn: () => void }) {
  const t = useT()
  return (
    <div className="relative flex-1 flex flex-col px-7 pt-20 pb-10 animate-fade-in overflow-hidden">
      <WelcomeBackdrop />
      <div className="relative flex items-center gap-3">
        <div className="relative h-11 w-11 rounded-[12px] bg-gradient-to-br from-white to-white/85 grid place-items-center shadow-glow">
          <span className="font-black text-[22px] -tracking-[0.04em] text-canvas leading-none">S</span>
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
          <span className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-brand-violet" />
        </div>
        <span className="text-[22px] font-bold tracking-tight">
          SWAPO<span className="text-brand">.</span>
        </span>
      </div>

      <div className="relative mt-auto mb-12 animate-slide-up">
        <p className="text-[12px] font-semibold text-brand mb-3">{t('onb.welcome.kicker')}</p>
        <h1 className="text-[36px] font-bold tracking-[-0.02em] leading-[1.04] text-balance">
          {t('onb.welcome.h1.1')}<br />{t('onb.welcome.h1.2')}
        </h1>
        <p className="text-[14px] text-ink-muted mt-5 leading-relaxed max-w-[300px]">
          {t('onb.welcome.tagline')}
        </p>
      </div>

      <div className="relative space-y-2.5">
        <button
          onClick={onContinue}
          className="w-full pt-[15px] pb-3.5 rounded-2xl bg-brand-gradient text-white shadow-glow font-semibold text-[15px] flex items-center justify-center transition active:scale-[0.99]"
        >
          {t('onb.welcome.cta')}
        </button>
        <button
          onClick={onSignIn}
          className="w-full pt-[15px] pb-3.5 rounded-2xl border border-line/70 bg-surface/60 text-[14.5px] font-medium text-ink-muted hover:border-line-strong transition"
        >
          {t('onb.welcome.signin')}
        </button>
      </div>
    </div>
  )
}

function WelcomeBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-x-0 top-[14%] h-[44%] grid place-items-center pointer-events-none">
      <div className="absolute h-[380px] w-[380px] rounded-full bg-brand/20 blur-[100px]" />
      <div className="absolute h-[260px] w-[260px] rounded-full bg-brand-violet/15 blur-[90px] translate-x-12 translate-y-6" />

      <div className="relative w-[280px] aspect-[1.7/1]">
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-surface-higher to-surface border border-line/60 shadow-soft"
          style={{ transform: 'translate(-44px, 26px) rotate(-11deg)' }}
        />

        <div
          className="absolute inset-0 rounded-2xl bg-brand-gradient shadow-soft overflow-hidden"
          style={{ transform: 'translate(-16px, 10px) rotate(-4deg)' }}
        >
          <div className="absolute top-4 left-5">
            <div className="h-2 w-16 rounded bg-white/90 mb-1" />
            <div className="h-1.5 w-20 rounded bg-white/55" />
          </div>
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div className="space-y-1">
              <div className="h-1 w-20 rounded bg-white/45" />
              <div className="h-1 w-14 rounded bg-white/40" />
            </div>
            <div className="h-7 w-7 rounded-lg bg-white/20 backdrop-blur-sm grid place-items-center">
              <span className="text-[10px] font-black text-white leading-none">S</span>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white to-zinc-100 shadow-soft overflow-hidden"
          style={{ transform: 'translate(12px, -6px) rotate(5deg)' }}
        >
          <div className="absolute top-4 left-5 flex items-start gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand to-brand-violet shrink-0" />
            <div className="pt-0.5 space-y-1">
              <div className="h-2 w-16 rounded bg-zinc-800" />
              <div className="h-1.5 w-20 rounded bg-zinc-400" />
            </div>
          </div>
          <div className="absolute bottom-4 left-5 right-5 space-y-1.5">
            <div className="h-1.5 w-28 rounded bg-zinc-300" />
            <div className="h-1.5 w-20 rounded bg-zinc-300" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ───────── Feature carousel ───────── */

function Features({
  slides, slide, total, onBack, onSkip, onNext,
}: {
  slides: Slide[]
  slide: number; total: number
  onBack: () => void; onSkip: () => void; onNext: () => void
}) {
  const t = useT()
  const s = slides[slide]
  return (
    <div className="relative flex-1 flex flex-col">
      <TopBar onBack={onBack} onSkip={onSkip} />

      <div className="relative flex-1 grid place-items-center px-7" key={`v-${slide}`}>
        <div className="animate-scale-in">
          {slide === 0 && <CaptureVisual />}
          {slide === 1 && <ExchangeVisual />}
          {slide === 2 && <PersonalizeVisual />}
        </div>
      </div>

      <div className="px-7 pb-10 pt-2" key={`c-${slide}`}>
        <div className="animate-slide-up">
          <p className="text-[12px] font-semibold text-brand mb-2">
            {s.eyebrow}
          </p>
          <h2 className="text-[28px] font-bold tracking-[-0.015em] leading-[1.08] text-balance whitespace-pre-line">
            {s.title}
          </h2>
          <p className="text-[13.5px] text-ink-muted leading-relaxed mt-3 max-w-[320px]">
            {s.body}
          </p>
        </div>

        <div className="mt-7 flex items-center justify-between">
          <Dots total={total} active={slide} />
          <button
            onClick={onNext}
            className="h-12 px-5 pt-px rounded-2xl bg-brand text-white text-[14.5px] font-semibold flex items-center justify-center active:scale-[0.99] transition"
          >
            {slide < total - 1 ? t('onb.feat.continue') : t('onb.welcome.cta')}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ───────── Phone ───────── */

function PhonePane({
  country, setCountry, phone, setPhone, onBack, onNext, isSignIn,
}: {
  country: Country; setCountry: (c: Country) => void
  phone: string; setPhone: (v: string) => void
  onBack: () => void; onNext: () => void
  isSignIn: boolean
}) {
  const t = useT()
  const [pickerOpen, setPickerOpen] = useState(false)
  const digits = phone.replace(/\D/g, '')
  const valid = digits.length >= 7

  const format = (raw: string) => {
    const d = raw.replace(/\D/g, '').slice(0, 15)
    if (country.code === 'MM') {
      if (d.length <= 1) return d
      if (d.length <= 4) return `${d.slice(0, 1)} ${d.slice(1)}`
      if (d.length <= 7) return `${d.slice(0, 1)} ${d.slice(1, 4)} ${d.slice(4)}`
      return `${d.slice(0, 1)} ${d.slice(1, 4)} ${d.slice(4, 7)} ${d.slice(7)}`
    }
    if (d.length <= 3) return d
    if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`
    if (d.length <= 10) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`
    return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 10)} ${d.slice(10)}`
  }

  const placeholder = country.code === 'MM' ? '9 123 456 789' : '123 456 7890'

  return (
    <div className="relative flex-1 flex flex-col animate-fade-in">
      <TopBar onBack={onBack} />

      <div className="flex-1 flex flex-col px-5 pt-4 pb-10">
        <div className="px-2">
          <StepEyebrow>{isSignIn ? t('onb.phone.signin.eyebrow') : t('onb.phone.eyebrow')}</StepEyebrow>
          <Headline>{isSignIn ? t('onb.otp.signin.title') : t('onb.phone.title')}</Headline>
          <SubBody>
            {isSignIn ? t('onb.otp.signin.body') : t('onb.phone.body')}
          </SubBody>
        </div>

        <div className="mt-6">
          <SectionLabel>{t('account.row.phone')}</SectionLabel>
          <div className="flex items-stretch gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              aria-label="Select country"
              className="flex items-center gap-2 px-3 h-12 rounded-2xl border border-line/70 bg-surface text-[14px] font-medium active:bg-surface-elevated hover:border-line-strong transition"
            >
              <span className="text-[14px] leading-none">{country.flag}</span>
              <span className="text-ink tabular-nums">+{country.dial}</span>
              <ChevronDown size={13} className="text-ink-dim" strokeWidth={2} />
            </button>
            <input
              autoFocus
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(format(e.target.value))}
              placeholder={placeholder}
              className="flex-1 min-w-0 h-12 px-4 rounded-2xl border border-line/70 bg-surface text-[14px] tabular-nums tracking-wide outline-none focus:border-brand/60 transition placeholder:text-ink-dim"
            />
          </div>
          <p className="text-[11.5px] text-ink-dim mt-2 ml-1">
            {t('onb.privacy.note')}
          </p>
        </div>

        <button
          onClick={onNext}
          disabled={!valid}
          className="mt-auto w-full pt-[15px] pb-3.5 rounded-2xl bg-brand text-white font-semibold text-[15px] flex items-center justify-center disabled:opacity-40 transition active:scale-[0.99]"
        >
          {t('onb.phone.cta')}
        </button>
      </div>

      {pickerOpen && (
        <CountryPicker
          current={country}
          onSelect={(c) => { setCountry(c); setPickerOpen(false) }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}

/* ───────── OTP ───────── */

function OtpPane({
  country, phone, otp, setOtp, onBack, onNext,
}: {
  country: Country
  phone: string; otp: string; setOtp: (v: string) => void
  onBack: () => void; onNext: () => void
}) {
  const tt = useT()
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const [seconds, setSeconds] = useState(60)
  const valid = otp.length === 6

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  useEffect(() => {
    refs.current[0]?.focus()
  }, [])

  const set = (idx: number, v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 1)
    const arr = otp.split('')
    while (arr.length < 6) arr.push('')
    arr[idx] = d
    const next = arr.join('').slice(0, 6)
    setOtp(next)
    if (d && idx < 5) refs.current[idx + 1]?.focus()
  }

  const onKey = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) refs.current[idx - 1]?.focus()
  }

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const d = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!d) return
    e.preventDefault()
    setOtp(d)
    refs.current[Math.min(d.length, 5)]?.focus()
  }

  return (
    <div className="relative flex-1 flex flex-col animate-fade-in">
      <TopBar onBack={onBack} />

      <div className="flex-1 flex flex-col px-5 pt-4 pb-10">
        <div className="px-2">
          <StepEyebrow>{tt('onb.otp.eyebrow')}</StepEyebrow>
          <Headline>{tt('onb.otp.title')}</Headline>
          <SubBody>
            {tt('onb.otp.body', { phone: `+${country.dial} ${phone || '—'}` })}
          </SubBody>
        </div>

        <div className="mt-6">
          <SectionLabel>{tt('onb.otp.title')}</SectionLabel>
          <div className="flex justify-between gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el }}
                inputMode="numeric"
                maxLength={1}
                value={otp[i] || ''}
                onChange={(e) => set(i, e.target.value)}
                onKeyDown={(e) => onKey(i, e)}
                onPaste={onPaste}
                className={`w-full h-14 rounded-2xl border bg-surface text-[18px] font-semibold text-center tabular-nums outline-none transition
                  ${otp[i] ? 'border-brand/60' : 'border-line/70'}
                  focus:border-brand/60`}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[12px] ml-1">
          <button
            onClick={() => { setSeconds(60) }}
            disabled={seconds > 0}
            className="text-ink-muted disabled:text-ink-dim font-medium"
          >
            {tt('onb.otp.resend')}
          </button>
          <span className="text-ink-dim tabular-nums">
            {seconds > 0 ? `in ${String(Math.floor(seconds / 60)).padStart(1, '0')}:${String(seconds % 60).padStart(2, '0')}` : 'available'}
          </span>
        </div>

        <button
          onClick={onNext}
          disabled={!valid}
          className="mt-auto w-full pt-[15px] pb-3.5 rounded-2xl bg-brand text-white font-semibold text-[15px] flex items-center justify-center disabled:opacity-40 transition active:scale-[0.99]"
        >
          {tt('common.confirm')}
        </button>
      </div>
    </div>
  )
}

/* ───────── Profile ───────── */

function ProfilePane({
  country,
  name, setName, role, setRole, company, setCompany,
  city, setCity, phone, setPhone, email, setEmail,
  website, setWebsite, bio, setBio,
  onBack, onNext,
}: {
  country: Country
  name: string; setName: (v: string) => void
  role: string; setRole: (v: string) => void
  company: string; setCompany: (v: string) => void
  city: string; setCity: (v: string) => void
  phone: string; setPhone: (v: string) => void
  email: string; setEmail: (v: string) => void
  website: string; setWebsite: (v: string) => void
  bio: string; setBio: (v: string) => void
  onBack: () => void; onNext: () => void
}) {
  const t = useT()
  const [pickerOpen, setPickerOpen] = useState(false)
  const valid = name.trim().length >= 2 && role.trim().length >= 2
  const BIO_MAX = 160

  return (
    <div className="relative flex-1 flex flex-col min-h-0 animate-fade-in">
      <TopBar onBack={onBack} />

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-5 pt-4 pb-6">
        <div className="px-2">
          <StepEyebrow>{t('onb.profile.eyebrow')}</StepEyebrow>
          <Headline>{t('onb.profile.title')}</Headline>
          <SubBody>{t('onb.profile.subtitle')}</SubBody>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mt-7 mb-7">
          <button
            type="button"
            onClick={(e) => { e.preventDefault() }}
            className="relative h-24 w-24 rounded-full border-2 border-dashed border-line-strong bg-surface grid place-items-center"
            aria-label={t('form.addPhoto')}
          >
            <Camera size={20} className="text-ink-dim" strokeWidth={1.8} />
            <span className="absolute -bottom-1 px-2 py-0.5 rounded-full bg-surface-elevated border border-line/70 text-[10px] font-semibold text-ink-muted">
              {t('form.addPhoto')}
            </span>
          </button>
        </div>

        <SectionLabel>{t('onb.profile.section.identity')}</SectionLabel>
        <div className="space-y-3 mb-6">
          <InputRow icon={<User size={15} />}      placeholder={t('onb.profile.placeholder.name')}    value={name}    onChange={setName} autoFocus />
          <InputRow icon={<Briefcase size={15} />} placeholder={t('onb.profile.placeholder.role')}    value={role}    onChange={setRole} />
          <InputRow icon={<Building2 size={15} />} placeholder={t('onb.profile.placeholder.company')} value={company} onChange={setCompany} />
        </div>

        <SectionLabel>{t('onb.profile.section.contact')}</SectionLabel>
        <div className="space-y-3 mb-6">
          <InputRow icon={<Phone size={15} />} placeholder={`+${country.dial} 9 …`} value={phone} onChange={setPhone} type="tel" inputMode="tel" />
          <InputRow icon={<Mail size={15} />}  placeholder={t('onb.profile.placeholder.email')} value={email} onChange={setEmail} type="email" inputMode="email" />
          <WebsiteRow value={website} onChange={setWebsite} />
          <LocationPickerRow value={city} onTap={() => setPickerOpen(true)} />
        </div>

        <SectionLabel>{t('onb.profile.help')}</SectionLabel>
        <div className="rounded-[20px] border border-line/60 bg-surface/60 p-4 mb-2">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
            rows={3}
            className="w-full bg-transparent outline-none text-[13.5px] leading-relaxed resize-none placeholder:text-ink-dim"
            placeholder=""
          />
          <p className="text-[11px] text-ink-dim mt-1.5 text-right tabular-nums">{bio.length} / {BIO_MAX}</p>
        </div>
      </div>

      <div className="px-5 pt-3 pb-10 border-t border-line/40 bg-canvas">
        <button
          onClick={onNext}
          disabled={!valid}
          className="w-full pt-[15px] pb-3.5 rounded-2xl bg-brand text-white font-semibold text-[15px] flex items-center justify-center disabled:opacity-40 transition active:scale-[0.99]"
        >
          {t('onb.profile.continue')}
        </button>
      </div>

      {pickerOpen && (
        <LocationPicker
          current={city}
          onSelect={(loc) => { setCity(loc.name); setPickerOpen(false) }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}

/* ───────── Permissions ───────── */

function PermissionsPane({
  notifOn, setNotifOn, nearbyOn, setNearbyOn, onBack, onNext,
}: {
  notifOn: boolean; setNotifOn: (v: boolean) => void
  nearbyOn: boolean; setNearbyOn: (v: boolean) => void
  onBack: () => void; onNext: () => void
}) {
  const t = useT()
  return (
    <div className="relative flex-1 flex flex-col animate-fade-in">
      <TopBar onBack={onBack} onSkip={onNext} />

      <div className="flex-1 flex flex-col px-7 pt-4 pb-10">
        <StepEyebrow>{t('onb.permissions.eyebrow')}</StepEyebrow>
        <Headline>{t('onb.permissions.title')}</Headline>
        <SubBody>{t('onb.permissions.body')}</SubBody>

        <div className="mt-6 space-y-3">
          <PermissionRow
            icon={<Bell size={18} strokeWidth={1.8} />}
            title={t('onb.permissions.notif')}
            sub={t('onb.permissions.notif.sub')}
            value={notifOn}
            onChange={setNotifOn}
          />
          <PermissionRow
            icon={<Radar size={18} strokeWidth={1.8} />}
            title={t('onb.permissions.nearby')}
            sub={t('onb.permissions.nearby.sub')}
            value={nearbyOn}
            onChange={setNearbyOn}
          />
        </div>

        <button
          onClick={onNext}
          className="mt-auto w-full pt-[15px] pb-3.5 rounded-2xl bg-brand text-white font-semibold text-[15px] flex items-center justify-center transition active:scale-[0.99]"
        >
          {t('onb.permissions.continue')}
        </button>
      </div>
    </div>
  )
}

function PermissionRow({
  icon, title, sub, value, onChange,
}: {
  icon: React.ReactNode; title: string; sub: string
  value: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="relative p-4 rounded-[20px] border border-line/60 bg-surface/60">
      <div className="flex items-start gap-3.5">
        <div className="h-11 w-11 rounded-2xl bg-surface-higher border border-line-strong grid place-items-center text-ink-muted flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-[14.5px] font-semibold leading-tight">{title}</p>
          <p className="text-[12px] text-ink-dim mt-1 leading-snug">{sub}</p>
        </div>
        <button
          onClick={() => onChange(!value)}
          aria-label={`Toggle ${title}`}
          className={`relative h-6 w-10 rounded-full transition flex-shrink-0 mt-1
            ${value ? 'bg-brand' : 'bg-surface-higher border border-line/70'}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${value ? 'left-[18px]' : 'left-0.5'}`} />
        </button>
      </div>
    </div>
  )
}

/* ───────── Done ───────── */

function DonePane({
  data, onBack, onEnter,
}: {
  data: OnboardingData; onBack: () => void; onEnter: () => void
}) {
  const t = useT()
  const initials = (data.name || 'You').split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className="relative flex-1 flex flex-col animate-fade-in">
      <TopBar onBack={onBack} />

      <div className="flex-1 flex flex-col px-7 pt-2 pb-10">
        <div className="animate-slide-up">
          <div className="h-12 w-12 rounded-full bg-brand/12 border border-brand/30 grid place-items-center mb-5">
            <Check size={20} className="text-brand" strokeWidth={2.4} />
          </div>
          <p className="text-[12px] font-semibold text-brand mb-2">
            {t('common.done')}
          </p>
          <Headline>
            {t('onb.done.title')}<br />
            <span className="text-ink">{(data.name || 'friend').split(' ')[0]}.</span>
          </Headline>
          <SubBody>{t('onb.done.body')}</SubBody>
        </div>

        {/* Card preview */}
        <div className="relative mt-7 mx-auto w-full max-w-[320px]">
          <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-brand/25 via-brand-violet/15 to-transparent blur-3xl" />
          <div className="relative rounded-[24px] aspect-[1.7/1] bg-hero-card border border-line/70 p-5 shadow-soft overflow-hidden">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-brand/25 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-brand-violet/20 blur-3xl" />

            <div className="relative flex items-start justify-between mb-7">
              <div>
                <p className="text-[10.5px] tracking-[0.22em] font-bold text-brand">SWAPO·</p>
                <p className="text-[10px] font-medium text-ink-dim mt-1">{data.city || 'Yangon'}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-white/95 grid place-items-center text-zinc-950 font-black text-[14px]">
                {initials}
              </div>
            </div>
            <div className="relative">
              <p className="text-[19px] font-bold text-white tracking-tight leading-tight">
                {data.name || 'Your name'}
              </p>
              <p className="text-[12px] text-white/55 mt-0.5">
                {[data.role, data.company].filter(Boolean).join(' · ') || 'Your role'}
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-[11.5px] text-ink-dim mt-4">{t('onb.profile.help')}</p>

        <button
          onClick={onEnter}
          className="mt-auto w-full pt-[15px] pb-3.5 rounded-2xl bg-brand text-white font-semibold text-[15px] flex items-center justify-center transition active:scale-[0.99]"
        >
          {t('onb.done.cta')}
        </button>
      </div>
    </div>
  )
}

/* ───────── Shared bits ───────── */

function TopBar({ onBack, onSkip }: { onBack: () => void; onSkip?: () => void }) {
  const t = useT()
  return (
    <header className="relative z-30 flex items-center justify-between px-4 pt-12 pb-2">
      <button
        onClick={onBack}
        aria-label={t('common.back')}
        className="h-10 w-10 grid place-items-center rounded-full border border-line/70 bg-surface/80 backdrop-blur"
      >
        <ChevronLeft size={20} strokeWidth={2} />
      </button>
      {onSkip ? (
        <button onClick={onSkip} className="text-[13px] font-medium text-ink-muted px-3 h-10 rounded-full">
          {t('common.skip')}
        </button>
      ) : <div className="w-10" />}
    </header>
  )
}

function Headline({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[28px] font-bold tracking-[-0.015em] leading-[1.08] text-balance">
      {children}
    </h2>
  )
}

function SubBody({ children }: { children: React.ReactNode }) {
  return <p className="text-[13.5px] text-ink-muted leading-relaxed mt-3 max-w-[320px]">{children}</p>
}

function StepEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] font-semibold text-brand mb-2">{children}</p>
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[12px] font-medium text-ink-dim mt-1 mb-2.5 ml-1">{children}</p>
}

function CountryPicker({
  current, onSelect, onClose,
}: {
  current: Country
  onSelect: (c: Country) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const filtered = q
    ? countries.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q.replace(/\D/g, '')) ||
        c.code.toLowerCase().includes(q),
      )
    : countries

  return (
    <div className="absolute inset-0 z-50 flex flex-col">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 animate-fade-in"
      />
      <div className="relative mt-auto bg-canvas rounded-t-3xl border-t border-line/70 max-h-[78%] flex flex-col animate-slide-up">
        <div className="pt-2 pb-1 flex justify-center">
          <span className="h-1 w-10 rounded-full bg-line-strong/70" />
        </div>
        <div className="px-5 pt-2 pb-3 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-ink">Select country</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 grid place-items-center rounded-full bg-surface text-ink-muted"
          >
            <X size={15} />
          </button>
        </div>

        <div className="px-5 pb-2">
          <div className="flex items-center gap-3 h-11 px-4 rounded-2xl border border-line/70 bg-surface focus-within:border-brand/60 transition">
            <Search size={15} className="text-ink-dim" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code"
              className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-ink-dim"
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="Clear" className="text-ink-dim">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto scrollbar-hide px-2 pt-1 pb-6">
          {filtered.map((c) => {
            const active = current.code === c.code
            return (
              <li key={c.code}>
                <button
                  onClick={() => onSelect(c)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition ${
                    active ? 'bg-surface-elevated' : 'active:bg-surface'
                  }`}
                >
                  <span className="h-9 w-9 grid place-items-center rounded-full bg-surface border border-line/60 text-[18px] leading-none">
                    {c.flag}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className={`block text-[14px] truncate ${active ? 'text-ink font-medium' : 'text-ink'}`}>
                      {c.name}
                    </span>
                  </span>
                  <span className="text-[13px] text-ink-dim tabular-nums">+{c.dial}</span>
                  {active && <Check size={15} className="text-brand ml-2" strokeWidth={2.4} />}
                </button>
              </li>
            )
          })}
          {filtered.length === 0 && (
            <li className="px-3 pt-4 pb-1 text-center text-[12px] text-ink-dim">No matching country.</li>
          )}
        </ul>
      </div>
    </div>
  )
}

function Dots({ total, active }: { total: number; active: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === active ? 'w-6 bg-ink' : 'w-1.5 bg-line-strong'
          }`}
        />
      ))}
    </div>
  )
}

/* ───────── Visuals ───────── */

function CaptureVisual() {
  return (
    <div className="relative">
      <div className="absolute -top-3 -left-1.5 h-[200px] w-[320px] rounded-[22px] bg-surface-higher border border-line/60 rotate-[8deg]" />
      <div className="absolute top-1 left-1.5 h-[200px] w-[320px] rounded-[22px] bg-surface-elevated border border-line/70 rotate-[3deg]" />

      <div className="relative h-[200px] w-[320px] rounded-[22px] bg-hero-card border border-line/70 shadow-soft overflow-hidden -rotate-[2deg]">
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-brand/25 blur-3xl" />
        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <p className="text-[10px] tracking-[0.22em] font-bold text-brand">SWAPO·</p>
            <div className="h-8 w-8 rounded-lg bg-white/95 grid place-items-center text-zinc-950 font-black text-[11px]">S</div>
          </div>
          <div>
            <p className="text-[18px] font-bold text-white tracking-tight">Su Su Aung</p>
            <p className="text-[11.5px] text-white/55 mt-1">Brand Manager · Yangon</p>
            <div className="mt-2.5 flex gap-1">
              <div className="h-[3px] w-12 rounded-full bg-white/15" />
              <div className="h-[3px] w-8 rounded-full bg-white/15" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -inset-5 pointer-events-none">
        <div className="absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2 border-brand rounded-tl-md" />
        <div className="absolute top-0 right-0 h-5 w-5 border-t-2 border-r-2 border-brand rounded-tr-md" />
        <div className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-brand rounded-bl-md" />
        <div className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-brand rounded-br-md" />
      </div>
    </div>
  )
}

function ExchangeVisual() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -m-12 rounded-full border border-brand/15" />
      <div className="absolute inset-0 -m-24 rounded-full border border-brand/8" />

      <div className="relative h-[180px] w-[180px] rounded-3xl bg-white p-4 grid place-items-center shadow-soft">
        <SmallFauxQR />
      </div>

      <div className="absolute -top-2 -right-2 h-9 w-9 rounded-full bg-canvas border border-line/70 grid place-items-center shadow-glow">
        <span className="text-[10px] font-black tracking-[0.04em] text-brand">S·</span>
      </div>
    </div>
  )
}

function PersonalizeVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-br from-brand/30 via-brand-violet/25 to-transparent blur-3xl" />

      <div className="relative h-[200px] w-[320px] rounded-[22px] bg-hero-card border border-line/70 shadow-soft overflow-hidden">
        <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-brand/30 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-brand-violet/25 blur-3xl" />

        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <p className="text-[10px] tracking-[0.22em] font-bold text-brand">SWAPO·</p>
            <div className="h-8 w-8 rounded-lg bg-white/95 grid place-items-center text-zinc-950 font-black text-[11px]">S</div>
          </div>
          <div>
            <p className="text-[18px] font-bold text-white tracking-tight">Your name here</p>
            <p className="text-[11.5px] text-white/55 mt-1">Your role · Your city</p>
          </div>
        </div>
      </div>

      <div className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-surface-elevated border border-line/60 grid place-items-center shadow-[0_4px_10px_rgba(0,0,0,0.35),0_12px_28px_rgba(0,0,0,0.45)]">
        <Wand2 size={15} className="text-brand" strokeWidth={2} />
      </div>
    </div>
  )
}

function SmallFauxQR() {
  const cells: boolean[][] = []
  let seed = 7
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
  for (let r = 0; r < 13; r++) {
    const row: boolean[] = []
    for (let c = 0; c < 13; c++) row.push(rnd() > 0.55)
    cells.push(row)
  }
  const finders: [number, number][] = [[0, 0], [0, 9], [9, 0]]
  for (const [fr, fc] of finders) {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const isOuter = r === 0 || r === 3 || c === 0 || c === 3
      const isCenter = r >= 1 && r <= 2 && c >= 1 && c <= 2
      cells[fr + r][fc + c] = isOuter || isCenter
    }
  }
  return (
    <div className="grid grid-cols-[repeat(13,1fr)] gap-[2px] w-full h-full">
      {cells.flatMap((row, r) => row.map((on, c) => (
        <div key={`${r}-${c}`} className={`aspect-square ${on ? 'bg-zinc-950' : 'bg-white'}`} />
      )))}
    </div>
  )
}
