import type { Contact } from './data'

export type Tab = 'home' | 'cardo' | 'ai' | 'me'

export type View =
  | { kind: 'tab'; tab: Tab }
  | { kind: 'card-detail'; contact: Contact }
  | { kind: 'edit-contact'; contact: Contact }
  | { kind: 'my-card' }
  | { kind: 'ai-create'; mode: 'card' | 'logo' }
  | { kind: 'register' }
  | { kind: 'scan' }
  | { kind: 'scan-share' }
  | { kind: 'manual' }
  | { kind: 'qr-scan' }
  | { kind: 'settings' }
  | { kind: 'nearby' }
  | { kind: 'notice' }
  | { kind: 'subscription' }
  | { kind: 'privacy' }
  | { kind: 'security' }
  | { kind: 'security-phone' }
  | { kind: 'security-session'; device: 'iphone' | 'mac' }
  | { kind: 'data-storage' }
  | { kind: 'language' }
  | { kind: 'appearance' }
  | { kind: 'faq' }
  | { kind: 'terms' }
  | { kind: 'help' }
  | { kind: 'about' }
  | { kind: 'notifications' }
  | { kind: 'edit-card'; scan?: boolean }
  | { kind: 'account' }
  | { kind: 'account-display-name' }
  | { kind: 'account-email' }
  | { kind: 'account-linked' }
  | { kind: 'analytics' }
  | { kind: 'invite' }
  | { kind: 'search' }
  | { kind: 'filter' }
  | { kind: 'exchange'; name: string; role: string; accent: string; phone: string; email: string; website?: string; city: string }

export type Nav = {
  go: (v: View) => void
  back: () => void
  tab: Tab
  setTab: (t: Tab) => void
}
