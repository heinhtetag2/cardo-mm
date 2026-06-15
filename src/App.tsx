import { useState } from 'react'
import { LayoutDashboard } from 'lucide-react'
import { PhoneFrame } from './components/PhoneFrame'
import { DashboardApp } from './dashboard/DashboardApp'
import { BottomNav } from './components/BottomNav'
import { TopBar } from './components/TopBar'
import { HomeScreen } from './screens/HomeScreen'
import { CardoScreen } from './screens/CardoScreen'
import { RegisterScreen } from './screens/RegisterScreen'
import { AICardScreen } from './screens/AICardScreen'
import { MyInfoScreen } from './screens/MyInfoScreen'
import { CardDetailScreen } from './screens/CardDetailScreen'
import { EditContactScreen } from './screens/EditContactScreen'
import { MyCardScreen } from './screens/MyCardScreen'
import { AICreateScreen } from './screens/AICreateScreen'
import { ScanScreen } from './screens/ScanScreen'
import { ScanShareScreen } from './screens/ScanShareScreen'
import { ManualEntryScreen } from './screens/ManualEntryScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { NearbyScreen } from './screens/NearbyScreen'
import { NotificationsScreen } from './screens/NotificationsScreen'
import {
  SubscriptionScreen, PrivacyScreen, SecurityScreen, DataStorageScreen,
  LanguageScreen, AppearanceScreen, NoticeScreen, FAQScreen, TermsScreen,
  HelpScreen, AboutScreen,
  SecurityPhoneScreen, SecuritySessionScreen,
} from './screens/SettingsSubScreens'
import {
  EditCardScreen, AccountScreen, EditDisplayNameScreen, EditRecoveryEmailScreen, LinkedAccountsScreen,
  AnalyticsScreen, InviteScreen, SearchScreen, FilterScreen, ExchangeScreen,
} from './screens/ExtraScreens'
import { ToastProvider } from './components/Toast'
import { OnboardingScreen } from './screens/OnboardingScreen'
import { useTheme, useAccent } from './theme'
import type { Tab, View } from './nav'
import type { Creation } from './data'

export default function App() {
  useTheme()
  useAccent()
  const [tab, setTab] = useState<Tab>('home')
  const [stack, setStack] = useState<View[]>([])
  const [view, setView] = useState<'phone' | 'dashboard'>('phone')
  const [creations, setCreations] = useState<Creation[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [onboarded, setOnboarded] = useState(false)

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const current = stack[stack.length - 1]
  const inSubScreen = !!current
  const showTopBar = !inSubScreen
  const showBottomNav = !inSubScreen

  const go = (v: View) => setStack((s) => [...s, v])
  const back = () => setStack((s) => s.slice(0, -1))
  const goTab = (t: Tab) => { setStack([]); setTab(t) }
  const addCreation = (c: Creation) => setCreations((prev) => [c, ...prev])
  const removeCreation = (id: string) => setCreations((prev) => prev.filter((c) => c.id !== id))
  const updateCreation = (id: string, patch: Partial<Creation>) =>
    setCreations((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))

  const handleLogout = () => {
    setStack([])
    setTab('home')
    setCreations([])
    setFavorites(new Set())
    setOnboarded(false)
  }

  if (view === 'dashboard') {
    return <DashboardApp onExit={() => setView('phone')} />
  }

  if (!onboarded) {
    return (
      <div className="relative h-full w-full flex items-center justify-center bg-canvas overflow-auto">
        <PhoneFrame>
          <OnboardingScreen onDone={() => setOnboarded(true)} />
        </PhoneFrame>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-canvas overflow-auto">
      {/* Dashboard launcher — absolute on the left of the phone */}
      <button
        onClick={() => setView('dashboard')}
        className="hidden md:flex absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 z-40 group items-center gap-2.5 h-12 pl-3 pr-4 rounded-full bg-surface-elevated/90 hover:bg-surface-higher border border-line/70 hover:border-brand/40 backdrop-blur transition shadow-soft"
        aria-label="Open Swapo dashboard"
      >
        <span className="h-8 w-8 rounded-full bg-brand-gradient grid place-items-center shadow-glow">
          <LayoutDashboard size={15} className="text-sand-0" strokeWidth={2} />
        </span>
        <span className="text-[13px] font-semibold text-ink leading-tight text-left">
          Dashboard
          <span className="block text-[10.5px] font-medium text-ink-dim tracking-wide">Open web app</span>
        </span>
      </button>

      <PhoneFrame>
        <ToastProvider>
        <div className="relative h-full w-full bg-canvas flex flex-col overflow-hidden">
          {!inSubScreen && (
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-glow-radial" />
          )}

          {showTopBar && (
            <TopBar
              onBellClick={() => go({ kind: 'notifications' })}
              onScanClick={tab === 'me' || tab === 'ai' ? undefined : () => go({ kind: 'scan-share' })}
              onProfileClick={() => goTab('me')}
            />
          )}

          <main className="relative flex-1 overflow-y-auto scrollbar-hide pb-28">
            {!inSubScreen && tab === 'home' && <HomeScreen go={go} setTab={goTab} />}
            {!inSubScreen && tab === 'cardo' && <CardoScreen go={go} favorites={favorites} />}
            {!inSubScreen && tab === 'ai' && (
              <AICardScreen
                go={go}
                creations={creations}
                onDelete={removeCreation}
                onUpdate={updateCreation}
              />
            )}
            {!inSubScreen && tab === 'me' && <MyInfoScreen go={go} onLogout={handleLogout} />}
          </main>

          {/* Sub-screens */}
          {current?.kind === 'card-detail' && (
            <CardDetailScreen
              contact={current.contact}
              onBack={back}
              go={go}
              isFavorite={favorites.has(current.contact.id)}
              onToggleFavorite={() => toggleFavorite(current.contact.id)}
            />
          )}
          {current?.kind === 'edit-contact' && (
            <EditContactScreen contact={current.contact} onBack={back} />
          )}
          {current?.kind === 'my-card' && <MyCardScreen onBack={back} go={go} />}
          {current?.kind === 'ai-create' && <AICreateScreen onBack={back} mode={current.mode} onSave={addCreation} />}
          {current?.kind === 'register' && <RegisterScreen go={go} onBack={back} />}
          {current?.kind === 'scan-share' && <ScanShareScreen onBack={back} go={go} />}
          {current?.kind === 'scan' && <ScanScreen onBack={back} onDone={() => goTab('cardo')} mode="card" />}
          {current?.kind === 'manual' && <ManualEntryScreen onBack={back} onDone={() => goTab('cardo')} />}
          {current?.kind === 'qr-scan' && <ScanScreen onBack={back} onDone={() => goTab('cardo')} mode="qr" />}
          {current?.kind === 'settings' && <SettingsScreen onBack={back} go={go} onLogout={handleLogout} />}
          {current?.kind === 'security-phone' && <SecurityPhoneScreen onBack={back} />}
          {current?.kind === 'security-session' && <SecuritySessionScreen onBack={back} device={current.device} />}
          {current?.kind === 'nearby' && <NearbyScreen onBack={back} go={go} />}
          {current?.kind === 'subscription' && <SubscriptionScreen onBack={back} />}
          {current?.kind === 'privacy' && <PrivacyScreen onBack={back} />}
          {current?.kind === 'security' && <SecurityScreen onBack={back} go={go} />}
          {current?.kind === 'data-storage' && <DataStorageScreen onBack={back} />}
          {current?.kind === 'language' && <LanguageScreen onBack={back} />}
          {current?.kind === 'appearance' && <AppearanceScreen onBack={back} />}
          {current?.kind === 'notice' && <NoticeScreen onBack={back} />}
          {current?.kind === 'faq' && <FAQScreen onBack={back} />}
          {current?.kind === 'terms' && <TermsScreen onBack={back} />}
          {current?.kind === 'help' && <HelpScreen onBack={back} />}
          {current?.kind === 'about' && <AboutScreen onBack={back} />}
          {current?.kind === 'notifications' && <NotificationsScreen onBack={back} go={go} />}
          {current?.kind === 'edit-card' && <EditCardScreen onBack={back} autoScan={current.scan} />}
          {current?.kind === 'account' && <AccountScreen onBack={back} go={go} />}
          {current?.kind === 'account-display-name' && <EditDisplayNameScreen onBack={back} />}
          {current?.kind === 'account-email' && <EditRecoveryEmailScreen onBack={back} />}
          {current?.kind === 'account-linked' && <LinkedAccountsScreen onBack={back} />}
          {current?.kind === 'analytics' && <AnalyticsScreen onBack={back} />}
          {current?.kind === 'invite' && <InviteScreen onBack={back} />}
          {current?.kind === 'search' && <SearchScreen onBack={back} go={go} />}
          {current?.kind === 'filter' && <FilterScreen onBack={back} />}
          {current?.kind === 'exchange' && (
            <ExchangeScreen
              onBack={back}
              name={current.name}
              role={current.role}
              accent={current.accent}
              phone={current.phone}
              email={current.email}
              website={current.website}
              city={current.city}
              onViewCard={(c) => setStack((s) => [...s.slice(0, -1), { kind: 'card-detail', contact: c }])}
            />
          )}

          {showBottomNav && <BottomNav active={tab} onChange={goTab} />}
        </div>
        </ToastProvider>
      </PhoneFrame>
    </div>
  )
}
