import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  ChevronLeft, ChevronDown, Camera, Bell, Radar, Check,
  X, Search, Wand2,
} from 'lucide-react'
import { InputRow } from '../components/InputRow'
import { LocationPicker, LocationPickerRow } from '../components/LocationPicker'
import { WebsiteRow } from '../components/WebsiteRow'
import { Button } from '../components/Button'
import { AuthScreen, type AuthResult } from './AuthScreen'
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
  | 'splash'
  | 'intro'
  | 'auth'
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
  const [step, setStep] = useState<Step>('splash')
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
    if (step === 'splash') return setStep('intro')
    if (step === 'intro') return setStep('auth')
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
    if (step === 'auth') return setStep('intro')
    if (step === 'phone') return setStep('auth')
    if (step === 'otp') return setStep('phone')
    if (step === 'profile') return setStep('otp')
    if (step === 'permissions') return setStep('profile')
    if (step === 'done') return setStep('permissions')
  }

  return (
    <div className="relative h-full w-full bg-canvas flex flex-col overflow-hidden">
      {step !== 'splash' && step !== 'intro' && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-glow-radial" />
      )}

      {step === 'splash' && <Splash onAdvance={() => setStep('intro')} />}

      {step === 'intro' && (
        <Intro
          slides={slides}
          slide={slide}
          setSlide={setSlide}
          total={totalSlides}
          onCreate={() => { setIsSignIn(false); setStep('auth') }}
          onSignIn={() => { setIsSignIn(true); setStep('auth') }}
        />
      )}

      {step === 'auth' && (
        <AuthScreen
          isSignIn={isSignIn}
          setIsSignIn={setIsSignIn}
          onBack={() => setStep('intro')}
          onUsePhone={() => setStep('phone')}
          onComplete={(info: AuthResult) => {
            if (info.name) setName(info.name)
            if (info.email) setEmail(info.email)
            if (isSignIn) onDone({ ...data, name: info.name ?? data.name, email: info.email ?? data.email })
            else setStep('profile')
          }}
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

/* ───────── Splash ───────── */

function Splash({ onAdvance }: { onAdvance: () => void }) {
  useEffect(() => {
    const t = setTimeout(onAdvance, 2200)
    return () => clearTimeout(t)
  }, [onAdvance])

  return (
    <div
      onClick={onAdvance}
      className="absolute inset-0 bg-sand-0 grid place-items-center cursor-pointer overflow-hidden"
    >
      <span
        className="flex items-end text-[42px] font-bold tracking-[-0.04em] text-canvas"
        style={{ animation: 'splashSettle 2.2s ease-in-out forwards' }}
      >
        {/* Wordmark — clean left-to-right wipe reveal */}
        <span
          className="relative inline-block"
          style={{ animation: 'splashReveal 0.9s cubic-bezier(0.16,1,0.3,1) both' }}
        >
          SWAPO
          {/* sheen sweep across the letters */}
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(100deg, transparent 35%, rgba(255,255,255,0.7) 50%, transparent 65%)',
              mixBlendMode: 'overlay',
              transform: 'translateX(-120%)',
              animation: 'splashSheen 1.1s ease-in-out 0.7s both',
            }}
          />
        </span>
        {/* Brand dot — bouncy pop with a soft pulsing glow */}
        <span
          className="inline-block text-brand"
          style={{
            animation:
              'splashDot 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.62s both, splashDotGlow 2.2s ease-in-out 1.3s infinite',
          }}
        >
          .
        </span>
      </span>

      <style>{`
        @keyframes splashReveal {
          0%   { clip-path: inset(0 100% 0 0); transform: translateY(8px); }
          100% { clip-path: inset(0 0 0 0);   transform: translateY(0); }
        }
        @keyframes splashSheen {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes splashDot {
          0%   { opacity: 0; transform: scale(0); }
          60%  { opacity: 1; transform: scale(1.4); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes splashDotGlow {
          0%, 100% { filter: drop-shadow(0 0 0 rgba(99,71,255,0)); }
          50%      { filter: drop-shadow(0 0 9px rgba(99,71,255,0.7)); }
        }
        @keyframes splashSettle {
          0%   { transform: scale(0.96); opacity: 0.85; }
          18%  { transform: scale(1);    opacity: 1; }
          88%  { transform: scale(1);    opacity: 1; }
          100% { transform: scale(1.04); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

/* ───────── Intro carousel (Revolut-style) ───────── */

const SLIDE_MS = 5000

function Intro({
  slides, slide, setSlide, total, onCreate, onSignIn,
}: {
  slides: Slide[]
  slide: number
  setSlide: (i: number) => void
  total: number
  onCreate: () => void
  onSignIn: () => void
}) {
  const t = useT()
  const startX = useRef<number | null>(null)
  const s = slides[slide]

  // Auto-advance through slides; stop on the last one.
  useEffect(() => {
    if (slide >= total - 1) return
    const id = setTimeout(() => setSlide(slide + 1), SLIDE_MS)
    return () => clearTimeout(id)
  }, [slide, total, setSlide])

  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return
    const dx = e.changedTouches[0].clientX - startX.current
    if (Math.abs(dx) > 48) {
      if (dx < 0 && slide < total - 1) setSlide(slide + 1)
      if (dx > 0 && slide > 0) setSlide(slide - 1)
    }
    startX.current = null
  }

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="absolute inset-0 bg-black text-sand-0 overflow-hidden flex flex-col animate-fade-in"
    >
      <IntroBackdrop />

      {/* Top segmented progress (Stories-style) */}
      <div className="relative z-10 pt-12 px-5 flex items-center gap-1">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="flex-1 h-[2.5px] rounded-full bg-sand-0/15 overflow-hidden"
          >
            <span
              key={`fill-${i}-${slide}`}
              className="block h-full bg-sand-0"
              style={
                i < slide
                  ? { width: '100%' }
                  : i === slide
                  ? { width: '0%', animation: `introFill ${SLIDE_MS}ms linear forwards` }
                  : { width: '0%' }
              }
            />
          </button>
        ))}
      </div>

      {/* Headline + body */}
      <div className="relative z-10 px-6 mt-7" key={`c-${slide}`}>
        <h1
          className="uppercase font-black tracking-[-0.01em] leading-[1.0] text-balance whitespace-pre-line animate-slide-up"
          style={{ fontSize: '32px' }}
        >
          {s.title}
        </h1>
        <p className="text-[14px] text-sand-0/55 mt-4 leading-relaxed max-w-[320px] animate-slide-up">
          {s.body}
        </p>
      </div>

      {/* Hero visual */}
      <div className="relative z-10 flex-1 min-h-0 grid place-items-center px-6 py-4" key={`v-${slide}`}>
        <div className="animate-scale-in">
          {slide === 0 && <CaptureVisual />}
          {slide === 1 && <ExchangeVisual />}
          {slide === 2 && <PersonalizeVisual />}
        </div>
      </div>

      {/* CTAs */}
      <div className="relative z-10 px-6 pb-9 pt-2 space-y-2.5">
        <button
          onClick={onCreate}
          className="w-full h-[52px] rounded-full bg-sand-0 text-black font-semibold text-[15px] active:scale-[0.99] transition"
        >
          {t('onb.welcome.cta')}
        </button>
        <button
          onClick={onSignIn}
          className="w-full h-[52px] rounded-full bg-sand-0/[0.06] border border-sand-0/15 text-sand-0 font-medium text-[15px] active:scale-[0.99] active:bg-sand-0/10 transition"
        >
          {t('onb.welcome.signin')}
        </button>
      </div>

      <style>{`
        @keyframes introFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}

function IntroBackdrop() {
  const stars = useMemo(() => {
    let seed = 11
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
    return Array.from({ length: 42 }, () => ({
      top: rnd() * 100,
      left: rnd() * 100,
      opacity: 0.15 + rnd() * 0.55,
      size: rnd() < 0.85 ? 1 : 2,
    }))
  }, [])

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Soft purple/violet glow rising from below */}
      <div
        className="absolute inset-x-0 bottom-0 h-[78%]"
        style={{
          background:
            'radial-gradient(70% 90% at 50% 100%, rgba(120,90,255,0.38) 0%, rgba(120,90,255,0.20) 22%, rgba(70,40,180,0.10) 45%, transparent 70%)',
        }}
      />

      {/* Radial rays from bottom-center */}
      <div
        className="absolute left-1/2 bottom-[-30%] -translate-x-1/2 w-[180%] aspect-square"
        style={{
          background:
            'conic-gradient(from 200deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.07) 4deg, transparent 9deg, transparent 18deg, rgba(255,255,255,0.05) 23deg, transparent 28deg, transparent 40deg, rgba(255,255,255,0.06) 45deg, transparent 50deg, transparent 64deg, rgba(255,255,255,0.04) 69deg, transparent 74deg, transparent 86deg, rgba(255,255,255,0.06) 92deg, transparent 97deg, transparent 110deg, rgba(255,255,255,0.05) 115deg, transparent 120deg, transparent 130deg, rgba(255,255,255,0.04) 135deg, transparent 140deg)',
          opacity: 0.85,
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 24%, transparent 64%)',
          maskImage: 'radial-gradient(circle at 50% 50%, black 24%, transparent 64%)',
        }}
      />

      {/* Stars */}
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            height: `${s.size}px`,
            width: `${s.size}px`,
            opacity: s.opacity,
          }}
        />
      ))}
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
              className="flex items-center gap-2 px-3.5 h-[58px] rounded-2xl bg-surface-elevated border border-transparent text-[15px] font-medium active:bg-surface-higher transition"
            >
              <span className="text-[15px] leading-none">{country.flag}</span>
              <span className="text-ink tabular-nums">+{country.dial}</span>
              <ChevronDown size={14} className="text-ink-dim" strokeWidth={2} />
            </button>
            <input
              autoFocus
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(format(e.target.value))}
              placeholder={placeholder}
              className="flex-1 min-w-0 h-[58px] px-4 rounded-2xl bg-surface-elevated border border-transparent text-[15px] tabular-nums tracking-wide outline-none focus:bg-surface-higher focus:ring-2 focus:ring-ink/10 transition placeholder:text-ink-dim"
            />
          </div>
          <p className="text-[12px] text-ink-dim mt-1.5 ml-1">
            {t('onb.privacy.note')}
          </p>
        </div>

        <button
          onClick={onNext}
          disabled={!valid}
          className="mt-auto w-full h-[52px] rounded-full bg-sand-0 text-black font-semibold text-[15px] flex items-center justify-center disabled:opacity-40 disabled:bg-surface-elevated disabled:text-ink-dim transition active:scale-[0.99]"
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
                className={`w-full h-16 rounded-2xl bg-surface-elevated border border-transparent text-[20px] font-semibold text-center tabular-nums outline-none transition
                  ${otp[i] ? 'bg-surface-higher ring-2 ring-ink/15' : ''}
                  focus:bg-surface-higher focus:ring-2 focus:ring-ink/15`}
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
          className="mt-auto w-full h-[52px] rounded-full bg-sand-0 text-black font-semibold text-[15px] flex items-center justify-center disabled:opacity-40 disabled:bg-surface-elevated disabled:text-ink-dim transition active:scale-[0.99]"
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
        <div className="space-y-2.5 mb-6">
          <InputRow placeholder={t('onb.profile.placeholder.name')}    value={name}    onChange={setName} autoFocus />
          <InputRow placeholder={t('onb.profile.placeholder.role')}    value={role}    onChange={setRole} />
          <InputRow placeholder={t('onb.profile.placeholder.company')} value={company} onChange={setCompany} />
        </div>

        <SectionLabel>{t('onb.profile.section.contact')}</SectionLabel>
        <div className="space-y-2.5 mb-6">
          <InputRow placeholder={`+${country.dial} 9 …`} value={phone} onChange={setPhone} type="tel" inputMode="tel" />
          <InputRow placeholder={t('onb.profile.placeholder.email')} value={email} onChange={setEmail} type="email" inputMode="email" />
          <WebsiteRow value={website} onChange={setWebsite} />
          <LocationPickerRow value={city} onTap={() => setPickerOpen(true)} />
        </div>

        <SectionLabel>{t('onb.profile.help')}</SectionLabel>
        <div className="rounded-2xl bg-surface-elevated border border-transparent focus-within:bg-surface-higher focus-within:ring-2 focus-within:ring-ink/10 p-4 mb-2 transition">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
            rows={3}
            className="w-full bg-transparent outline-none text-[14px] leading-relaxed resize-none placeholder:text-ink-dim"
            placeholder=""
          />
          <p className="text-[11px] text-ink-dim mt-1.5 text-right tabular-nums">{bio.length} / {BIO_MAX}</p>
        </div>
      </div>

      <div className="px-5 pt-3 pb-10 border-t border-line/40 bg-canvas">
        <button
          onClick={onNext}
          disabled={!valid}
          className="w-full h-[52px] rounded-full bg-sand-0 text-black font-semibold text-[15px] flex items-center justify-center disabled:opacity-40 disabled:bg-surface-elevated disabled:text-ink-dim transition active:scale-[0.99]"
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
          className="mt-auto w-full h-[52px] rounded-full bg-sand-0 text-black font-semibold text-[15px] flex items-center justify-center transition active:scale-[0.99]"
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
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-sand-0 transition-all ${value ? 'left-[18px]' : 'left-0.5'}`} />
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
              <div className="h-10 w-10 rounded-xl bg-sand-0/95 grid place-items-center text-zinc-950 font-black text-[14px]">
                {initials}
              </div>
            </div>
            <div className="relative">
              <p className="text-[19px] font-bold text-sand-0 tracking-tight leading-tight">
                {data.name || 'Your name'}
              </p>
              <p className="text-[12px] text-sand-0/55 mt-0.5">
                {[data.role, data.company].filter(Boolean).join(' · ') || 'Your role'}
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-[11.5px] text-ink-dim mt-4">{t('onb.profile.help')}</p>

        <button
          onClick={onEnter}
          className="mt-auto w-full h-[52px] rounded-full bg-sand-0 text-black font-semibold text-[15px] flex items-center justify-center transition active:scale-[0.99]"
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
            <div className="h-8 w-8 rounded-lg bg-sand-0/95 grid place-items-center text-zinc-950 font-black text-[11px]">S</div>
          </div>
          <div>
            <p className="text-[18px] font-bold text-sand-0 tracking-tight">Su Su Aung</p>
            <p className="text-[11.5px] text-sand-0/55 mt-1">Brand Manager · Yangon</p>
            <div className="mt-2.5 flex gap-1">
              <div className="h-[3px] w-12 rounded-full bg-sand-0/15" />
              <div className="h-[3px] w-8 rounded-full bg-sand-0/15" />
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

      <div className="relative h-[180px] w-[180px] rounded-3xl bg-sand-0 p-4 grid place-items-center shadow-soft">
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
            <div className="h-8 w-8 rounded-lg bg-sand-0/95 grid place-items-center text-zinc-950 font-black text-[11px]">S</div>
          </div>
          <div>
            <p className="text-[18px] font-bold text-sand-0 tracking-tight">Your name here</p>
            <p className="text-[11.5px] text-sand-0/55 mt-1">Your role · Your city</p>
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
        <div key={`${r}-${c}`} className={`aspect-square ${on ? 'bg-zinc-950' : 'bg-sand-0'}`} />
      )))}
    </div>
  )
}
