import type { Contact } from './data'

export type Tab = 'home' | 'cardo' | 'ai' | 'me'

export type View =
  | { kind: 'tab'; tab: Tab }
  | { kind: 'card-detail'; contact: Contact }
  | { kind: 'my-card' }
  | { kind: 'ai-create'; mode: 'card' | 'logo' }
  | { kind: 'register' }
  | { kind: 'scan' }
  | { kind: 'manual' }
  | { kind: 'qr-scan' }
  | { kind: 'settings' }
  | { kind: 'nearby' }
  | { kind: 'notice' }
  | { kind: 'subscription' }
  | { kind: 'privacy' }
  | { kind: 'security' }
  | { kind: 'data-storage' }
  | { kind: 'language' }
  | { kind: 'appearance' }
  | { kind: 'faq' }
  | { kind: 'terms' }
  | { kind: 'help' }
  | { kind: 'about' }
  | { kind: 'notifications' }
  | { kind: 'edit-profile' }
  | { kind: 'analytics' }
  | { kind: 'invite' }
  | { kind: 'search' }
  | { kind: 'filter' }
  | { kind: 'exchange'; name: string; role: string; accent: string }

export type Nav = {
  go: (v: View) => void
  back: () => void
  tab: Tab
  setTab: (t: Tab) => void
}
