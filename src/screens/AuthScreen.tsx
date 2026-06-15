import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ChevronLeft, Mail, Eye, EyeOff, Loader2, MailCheck,
} from 'lucide-react'
import { useT } from '../i18n'

type Provider = 'Apple' | 'Google' | 'Facebook'
type AuthStep = 'landing' | 'connecting' | 'email' | 'forgot' | 'sent'

export type AuthResult = { name?: string; email?: string; provider?: Provider }

export function AuthScreen({
  isSignIn,
  setIsSignIn,
  onBack,
  onComplete,
}: {
  isSignIn: boolean
  setIsSignIn: (v: boolean) => void
  onBack: () => void
  onComplete: (info: AuthResult) => void
}) {
  const [step, setStep] = useState<AuthStep>('landing')
  const [provider, setProvider] = useState<Provider>('Google')
  const [email, setEmail] = useState('')

  const startSocial = (p: Provider) => {
    setProvider(p)
    setStep('connecting')
  }

  const back = () => {
    if (step === 'landing') return onBack()
    if (step === 'sent') return setStep('email')
    if (step === 'forgot') return setStep('email')
    // connecting + email return to the method chooser
    return setStep('landing')
  }

  return (
    <div className="relative flex-1 flex flex-col animate-fade-in">
      {step === 'landing' && (
        <Landing
          isSignIn={isSignIn}
          setIsSignIn={setIsSignIn}
          onBack={onBack}
          onSocial={startSocial}
          onEmail={() => setStep('email')}
        />
      )}

      {step === 'connecting' && (
        <Connecting
          provider={provider}
          onBack={back}
          onDone={() => onComplete({ provider })}
        />
      )}

      {step === 'email' && (
        <EmailForm
          isSignIn={isSignIn}
          email={email}
          setEmail={setEmail}
          onBack={back}
          onForgot={() => setStep('forgot')}
          onSubmit={(name) => onComplete({ name, email })}
        />
      )}

      {step === 'forgot' && (
        <Forgot
          email={email}
          setEmail={setEmail}
          onBack={back}
          onSent={() => setStep('sent')}
        />
      )}

      {step === 'sent' && (
        <Sent email={email} onBack={() => setStep('email')} />
      )}
    </div>
  )
}

/* ───────── Landing — method chooser ───────── */

function Landing({
  isSignIn, setIsSignIn, onBack, onSocial, onEmail,
}: {
  isSignIn: boolean
  setIsSignIn: (v: boolean) => void
  onBack: () => void
  onSocial: (p: Provider) => void
  onEmail: () => void
}) {
  const t = useT()
  return (
    <>
      <TopBar onBack={onBack} />
      <div className="flex-1 flex flex-col px-5 pt-4 pb-10">
        <div className="px-2">
          <Headline>{isSignIn ? t('auth.signin.title') : t('auth.signup.title')}</Headline>
          <SubBody>{isSignIn ? t('auth.signin.body') : t('auth.signup.body')}</SubBody>
        </div>

        <div className="mt-8 space-y-2.5">
          <SocialButton icon={<AppleIcon />} label={t('auth.social.apple')} onClick={() => onSocial('Apple')} />
          <SocialButton icon={<GoogleIcon />} label={t('auth.social.google')} onClick={() => onSocial('Google')} />
          <SocialButton icon={<FacebookIcon />} label={t('auth.social.facebook')} onClick={() => onSocial('Facebook')} />
        </div>

        <Divider label={t('auth.divider')} />

        <div className="space-y-2.5">
          <SecondaryRow icon={<Mail size={18} strokeWidth={1.9} />} label={t('auth.email')} onClick={onEmail} />
        </div>

        <div className="mt-auto pt-7">
          <p className="text-center text-[13px] text-ink-muted">
            {isSignIn ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="font-semibold text-ink underline-offset-2 hover:underline"
            >
              {isSignIn ? t('auth.signup.link') : t('auth.signin.link')}
            </button>
          </p>
          <p className="text-center text-[11.5px] text-ink-dim mt-4 px-4 leading-relaxed">
            {t('auth.terms')}
          </p>
        </div>
      </div>
    </>
  )
}

/* ───────── Connecting — social provider loading ───────── */

function Connecting({
  provider, onBack, onDone,
}: {
  provider: Provider; onBack: () => void; onDone: () => void
}) {
  const t = useT()
  useEffect(() => {
    const id = setTimeout(onDone, 1600)
    return () => clearTimeout(id)
  }, [onDone])

  return (
    <>
      <TopBar onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-16 text-center">
        <div className="relative h-24 w-24 grid place-items-center">
          <span className="absolute inset-0 rounded-full border-2 border-line/50" />
          <Loader2 size={84} className="absolute text-brand animate-spin [animation-duration:1.1s]" strokeWidth={1.2} />
          <span className="relative h-16 w-16 rounded-full bg-surface-elevated border border-line/70 grid place-items-center shadow-soft">
            <span className="scale-125">
              {provider === 'Apple' ? <AppleIcon /> : provider === 'Google' ? <GoogleIcon /> : <FacebookIcon />}
            </span>
          </span>
        </div>
        <h2 className="text-[19px] font-semibold tracking-tight mt-8">
          {t('auth.connecting', { provider })}
        </h2>
        <p className="text-[13px] text-ink-muted leading-relaxed mt-2 max-w-[280px]">
          {t('auth.connecting.body', { provider })}
        </p>
      </div>
    </>
  )
}

/* ───────── Email form — sign in / sign up ───────── */

function EmailForm({
  isSignIn, email, setEmail, onBack, onForgot, onSubmit,
}: {
  isSignIn: boolean
  email: string; setEmail: (v: string) => void
  onBack: () => void
  onForgot: () => void
  onSubmit: (name?: string) => void
}) {
  const t = useT()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const passOk = password.length >= 8
  const nameOk = isSignIn || name.trim().length >= 2
  const valid = emailOk && passOk && nameOk

  return (
    <>
      <TopBar onBack={onBack} />
      <div className="flex-1 flex flex-col px-5 pt-4 pb-10">
        <div className="px-2">
          <Headline>{isSignIn ? t('auth.email.signin.title') : t('auth.email.signup.title')}</Headline>
          <SubBody>{isSignIn ? t('auth.signin.body') : t('auth.signup.body')}</SubBody>
        </div>

        <div className="mt-7 space-y-2.5">
          {!isSignIn && (
            <Field
              label={t('auth.field.name')}
              value={name}
              onChange={setName}
              autoFocus
              autoComplete="name"
            />
          )}
          <Field
            label={t('auth.field.email')}
            value={email}
            onChange={setEmail}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoFocus={isSignIn}
          />
          <Field
            label={t('auth.field.password')}
            value={password}
            onChange={setPassword}
            type={show ? 'text' : 'password'}
            autoComplete={isSignIn ? 'current-password' : 'new-password'}
            trailing={
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? 'Hide password' : 'Show password'}
                className="text-ink-dim hover:text-ink-muted transition p-1"
              >
                {show ? <EyeOff size={18} strokeWidth={1.9} /> : <Eye size={18} strokeWidth={1.9} />}
              </button>
            }
          />
        </div>

        <div className="mt-2.5 flex items-center justify-between px-1">
          <p className="text-[12px] text-ink-dim">{!isSignIn && t('auth.field.password.hint')}</p>
          {isSignIn && (
            <button onClick={onForgot} className="text-[12.5px] font-medium text-ink-muted">
              {t('auth.forgot')}
            </button>
          )}
        </div>

        <button
          onClick={() => onSubmit(name.trim() || undefined)}
          disabled={!valid}
          className="mt-auto w-full h-[52px] rounded-full bg-sand-0 text-black font-semibold text-[15px] flex items-center justify-center disabled:opacity-40 disabled:bg-surface-elevated disabled:text-ink-dim transition active:scale-[0.99]"
        >
          {isSignIn ? t('auth.signin.cta') : t('auth.signup.cta')}
        </button>
      </div>
    </>
  )
}

/* ───────── Forgot password ───────── */

function Forgot({
  email, setEmail, onBack, onSent,
}: {
  email: string; setEmail: (v: string) => void
  onBack: () => void; onSent: () => void
}) {
  const t = useT()
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  return (
    <>
      <TopBar onBack={onBack} />
      <div className="flex-1 flex flex-col px-5 pt-4 pb-10">
        <div className="px-2">
          <Headline>{t('auth.forgot.title')}</Headline>
          <SubBody>{t('auth.forgot.body')}</SubBody>
        </div>

        <div className="mt-7">
          <Field
            label={t('auth.field.email')}
            value={email}
            onChange={setEmail}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoFocus
          />
        </div>

        <button
          onClick={onSent}
          disabled={!emailOk}
          className="mt-auto w-full h-[52px] rounded-full bg-sand-0 text-black font-semibold text-[15px] flex items-center justify-center disabled:opacity-40 disabled:bg-surface-elevated disabled:text-ink-dim transition active:scale-[0.99]"
        >
          {t('auth.forgot.cta')}
        </button>
      </div>
    </>
  )
}

/* ───────── Reset link sent ───────── */

function Sent({ email, onBack }: { email: string; onBack: () => void }) {
  const t = useT()
  return (
    <>
      <TopBar onBack={onBack} />
      <div className="flex-1 flex flex-col px-7 pt-4 pb-10">
        <div className="animate-slide-up">
          <div className="h-14 w-14 rounded-2xl bg-brand/12 border border-brand/30 grid place-items-center mb-6">
            <MailCheck size={24} className="text-brand" strokeWidth={2} />
          </div>
          <Headline>{t('auth.sent.title')}</Headline>
          <SubBody>{t('auth.sent.body', { email: email || '—' })}</SubBody>
        </div>

        <div className="mt-auto space-y-2.5">
          <button
            onClick={onBack}
            className="w-full h-[52px] rounded-full bg-sand-0 text-black font-semibold text-[15px] flex items-center justify-center transition active:scale-[0.99]"
          >
            {t('auth.sent.cta')}
          </button>
          <button className="w-full h-[52px] rounded-full text-ink-muted font-medium text-[14px] flex items-center justify-center">
            {t('auth.sent.resend')}
          </button>
        </div>
      </div>
    </>
  )
}

/* ───────── Shared bits ───────── */

function TopBar({ onBack }: { onBack: () => void }) {
  const t = useT()
  return (
    <header className="relative z-30 flex items-center px-4 pt-12 pb-2">
      <button
        onClick={onBack}
        aria-label={t('common.back')}
        className="h-10 w-10 grid place-items-center rounded-full border border-line/70 bg-surface/80 backdrop-blur"
      >
        <ChevronLeft size={20} strokeWidth={2} />
      </button>
    </header>
  )
}

function Headline({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[28px] font-bold tracking-[-0.015em] leading-[1.08] text-balance">
      {children}
    </h2>
  )
}

function SubBody({ children }: { children: ReactNode }) {
  return <p className="text-[13.5px] text-ink-muted leading-relaxed mt-3 max-w-[320px]">{children}</p>
}

function SocialButton({
  icon, label, onClick,
}: {
  icon: ReactNode; label: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="relative w-full h-[54px] rounded-2xl bg-surface-elevated border border-line/40 flex items-center justify-center active:scale-[0.99] active:bg-surface-higher transition"
    >
      <span className="absolute left-5 grid place-items-center">{icon}</span>
      <span className="text-[15px] font-semibold text-ink">{label}</span>
    </button>
  )
}

function SecondaryRow({
  icon, label, onClick,
}: {
  icon: ReactNode; label: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="relative w-full h-[54px] rounded-2xl border border-line/60 bg-surface/50 flex items-center justify-center active:scale-[0.99] active:bg-surface transition"
    >
      <span className="absolute left-5 grid place-items-center text-ink-muted">{icon}</span>
      <span className="text-[15px] font-medium text-ink">{label}</span>
    </button>
  )
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <span className="flex-1 h-px bg-line/60" />
      <span className="text-[12px] font-medium text-ink-dim uppercase tracking-wide">{label}</span>
      <span className="flex-1 h-px bg-line/60" />
    </div>
  )
}

function Field({
  label, value, onChange, type = 'text', inputMode, autoFocus, autoComplete, trailing,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  inputMode?: 'text' | 'email' | 'tel' | 'numeric'
  autoFocus?: boolean
  autoComplete?: string
  trailing?: ReactNode
}) {
  const [focused, setFocused] = useState(false)
  const float = focused || value.length > 0
  const ref = useRef<HTMLInputElement>(null)

  return (
    <label
      className={`relative flex items-center rounded-2xl bg-surface-elevated border border-transparent transition ${
        focused ? 'bg-surface-higher ring-2 ring-ink/10' : ''
      }`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute left-4 transition-all duration-150 ${
          float ? 'top-2 text-[11px] text-ink-dim leading-none' : 'top-1/2 -translate-y-1/2 text-[15px] text-ink-dim'
        }`}
      >
        {label}
      </span>
      <input
        ref={ref}
        autoFocus={autoFocus}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className={`flex-1 min-w-0 h-[58px] bg-transparent outline-none text-[15px] text-ink px-4 ${
          float ? 'pt-5 pb-1.5' : ''
        } ${trailing ? 'pr-2' : ''}`}
      />
      {trailing && <span className="pr-3 flex-shrink-0">{trailing}</span>}
    </label>
  )
}

/* ───────── Brand marks ───────── */

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" className="text-ink" aria-hidden="true">
      <path d="M16.36 12.78c.02 2.5 2.2 3.33 2.22 3.34-.02.06-.35 1.2-1.15 2.37-.69 1.02-1.41 2.03-2.55 2.05-1.11.02-1.47-.66-2.74-.66-1.27 0-1.67.64-2.72.68-1.09.04-1.93-1.1-2.63-2.11-1.43-2.07-2.52-5.85-1.05-8.4.73-1.27 2.03-2.07 3.44-2.09 1.07-.02 2.09.72 2.74.72.66 0 1.89-.89 3.19-.76.54.02 2.07.22 3.05 1.65-.08.05-1.82 1.06-1.8 3.16M14.28 5.38c.58-.7.97-1.68.86-2.65-.83.03-1.84.55-2.44 1.25-.54.62-1.01 1.61-.88 2.56.93.07 1.88-.47 2.46-1.16" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width={19} height={19} aria-hidden="true">
      <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.38A12 12 0 0 0 24 12Z" />
      <path fill="#fff" d="M16.67 15.47 17.2 12h-3.32V9.75c0-.95.46-1.87 1.95-1.87h1.51V4.93s-1.37-.24-2.68-.24c-2.74 0-4.53 1.66-4.53 4.67V12H7.08v3.47h3.04v8.38a12.1 12.1 0 0 0 3.76 0v-8.38h2.79Z" />
    </svg>
  )
}
