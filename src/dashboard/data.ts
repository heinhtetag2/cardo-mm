export type DashRange = '7d' | '30d' | 'this_month' | 'last_month'

export type ActivityKind = 'saved' | 'scanned' | 'ai-gen' | 'exchanged' | 'level-up' | 'pro-upgrade'

export type ActivityEvent = {
  kind: ActivityKind
  date: string
  primary: string
  secondary: string
  href?: string
}

export const DASH_USER = {
  firstName: 'Aung',
  lastName: 'Ko Ko',
  email: 'aungkoko@swapo.mm',
  phone: '+95 9 7700 11 22',
  role: 'Marketing Lead',
  company: 'Bagan Heritage Co.',
  city: 'Yangon',
  initials: 'AK',
  joined: '2025-08-14',
}

export const DASH_STATS = {
  savedContacts: 187,
  thisMonthAdded: 24,
  myCardScans: 1432,
  myCardScansThisMonth: 96,
  aiCreditsLeft: 7,
  aiCreditsCap: 20,
  trustLevel: 3,
  trustLevelLabel: 'Networker',
  trustNextThreshold: 250,
  cardsCount: 4,
  exchangesThisMonth: 12,
}

export const TAG_BREAKDOWN: { tag: string; count: number }[] = [
  { tag: 'Lead', count: 64 },
  { tag: 'Client', count: 42 },
  { tag: 'Partner', count: 28 },
  { tag: 'Friend', count: 31 },
  { tag: 'Mentor', count: 14 },
  { tag: 'Vendor', count: 8 },
]

export const RECENT_ACTIVITY: ActivityEvent[] = [
  {
    kind: 'saved',
    date: '2026-04-26T15:32:00',
    primary: 'Mya Thandar',
    secondary: 'Marketing Lead · Bagan Heritage Co.',
  },
  {
    kind: 'scanned',
    date: '2026-04-26T11:08:00',
    primary: 'Your card was saved by 4 people',
    secondary: 'Yangon Tech Meetup',
  },
  {
    kind: 'ai-gen',
    date: '2026-04-25T19:14:00',
    primary: 'AI Card v3 generated',
    secondary: 'Style: Minimal · 2 credits used',
  },
  {
    kind: 'exchanged',
    date: '2026-04-24T14:00:00',
    primary: 'Exchanged with Kyaw Min',
    secondary: 'Engineer · TechBM · Nearby',
  },
  {
    kind: 'level-up',
    date: '2026-04-22T09:30:00',
    primary: 'Trust Level 3 unlocked',
    secondary: 'Networker · verified profile + 100 saves',
  },
]

const RANGE_PATTERNS: Record<DashRange, { values: number[]; labels: string[]; bucket: 'day' | 'week' }> = {
  '7d': {
    values: [3, 1, 5, 2, 6, 1, 6],
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    bucket: 'day',
  },
  '30d': {
    values: [4, 7, 5, 8],
    labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
    bucket: 'week',
  },
  this_month: {
    values: [6, 9, 4, 5],
    labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
    bucket: 'week',
  },
  last_month: {
    values: [5, 7, 4, 6, 3],
    labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5'],
    bucket: 'week',
  },
}

const RANGE_TREND: Record<DashRange, number> = {
  '7d': 18.2,
  '30d': -4.5,
  this_month: 22.7,
  last_month: 9.1,
}

export function getRangeData(range: DashRange) {
  const p = RANGE_PATTERNS[range]
  const total = p.values.reduce((s, v) => s + v, 0)
  const avg = Math.round(total / p.values.length)
  const points = p.values.map((value, i) => ({ value, label: p.labels[i] }))
  return {
    points,
    total,
    avg,
    trend: RANGE_TREND[range],
    bucket: p.bucket,
    surveys: total,
  }
}

export const RANGE_OPTIONS: { value: DashRange; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'this_month', label: 'This month' },
  { value: 'last_month', label: 'Last month' },
]

// ---------- Saved contacts (mirrors mobile SwapoScreen) ----------
export type ContactSource = 'scan' | 'manual' | 'exchange' | 'ai' | 'nearby'
export type ContactAccent = 'blue' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate' | 'teal'

export type SavedContact = {
  id: string
  name: string
  role: string
  company: string
  city: string
  tag: string
  source: ContactSource
  accent: ContactAccent
  savedAt: string
  lastSeen: string
  email?: string
  phone?: string
  starred?: boolean
}

export const SAVED_CONTACTS: SavedContact[] = [
  { id: 'c1', name: 'Mya Thandar', role: 'Marketing Lead', company: 'Bagan Heritage Co.', city: 'Yangon', tag: 'Client', source: 'scan', accent: 'rose', savedAt: '2026-04-26', lastSeen: '2 days ago', email: 'mya@baganheritage.mm', phone: '+95 9 4411 22 33', starred: true },
  { id: 'c2', name: 'Kyaw Min', role: 'Senior Engineer', company: 'TechBM', city: 'Yangon', tag: 'Lead', source: 'exchange', accent: 'blue', savedAt: '2026-04-24', lastSeen: '4 days ago', email: 'kyawmin@techbm.com', phone: '+95 9 7755 88 90' },
  { id: 'c3', name: 'Su Su Win', role: 'Product Designer', company: 'Studio Maw', city: 'Mandalay', tag: 'Friend', source: 'scan', accent: 'violet', savedAt: '2026-04-21', lastSeen: '6 days ago', email: 'susu@studiomaw.com' },
  { id: 'c4', name: 'U Thant Zin', role: 'Founder', company: 'Yangon Roastery', city: 'Yangon', tag: 'Partner', source: 'manual', accent: 'amber', savedAt: '2026-04-19', lastSeen: '1 week ago', email: 'thantzin@yangonroastery.mm' },
  { id: 'c5', name: 'Hnin Nu', role: 'Operations Manager', company: 'KBZ Logistics', city: 'Yangon', tag: 'Lead', source: 'nearby', accent: 'teal', savedAt: '2026-04-18', lastSeen: '1 week ago', phone: '+95 9 9000 12 34' },
  { id: 'c6', name: 'Nay Lin', role: 'Finance Director', company: 'AYA Bank', city: 'Naypyidaw', tag: 'Client', source: 'exchange', accent: 'emerald', savedAt: '2026-04-15', lastSeen: '12 days ago', email: 'nay.lin@ayabank.com' },
  { id: 'c7', name: 'Phyu Phyu', role: 'Brand Strategist', company: 'Mingala Media', city: 'Yangon', tag: 'Partner', source: 'scan', accent: 'rose', savedAt: '2026-04-13', lastSeen: '2 weeks ago', email: 'phyu@mingala.media', starred: true },
  { id: 'c8', name: 'Soe Moe', role: 'Backend Engineer', company: 'Atom Telco', city: 'Yangon', tag: 'Friend', source: 'manual', accent: 'slate', savedAt: '2026-04-10', lastSeen: '2 weeks ago', email: 'soemoe@atom.com.mm' },
  { id: 'c9', name: 'Aye Aye Maw', role: 'Hotel Manager', company: 'Bagan Sunset Resort', city: 'Bagan', tag: 'Vendor', source: 'scan', accent: 'amber', savedAt: '2026-04-08', lastSeen: '3 weeks ago', phone: '+95 9 6611 22 33' },
  { id: 'c10', name: 'Thuza Win', role: 'Growth Mentor', company: 'Phandeeyar', city: 'Yangon', tag: 'Mentor', source: 'exchange', accent: 'violet', savedAt: '2026-04-05', lastSeen: '3 weeks ago', email: 'thuza@phandeeyar.org', starred: true },
  { id: 'c11', name: 'Ye Yint Aung', role: 'Rice Trader', company: 'Ayeyarwady Co-op', city: 'Pathein', tag: 'Vendor', source: 'manual', accent: 'emerald', savedAt: '2026-04-02', lastSeen: '1 month ago', phone: '+95 9 4400 55 66' },
  { id: 'c12', name: 'Khin Maung Win', role: 'Country Manager', company: 'MPT Telecom', city: 'Yangon', tag: 'Lead', source: 'nearby', accent: 'teal', savedAt: '2026-03-30', lastSeen: '1 month ago', email: 'khin.maung@mpt.com.mm' },
  { id: 'c13', name: 'Zin Mar Aye', role: 'Tour Operator', company: 'Inle Lake Tours', city: 'Taunggyi', tag: 'Partner', source: 'scan', accent: 'blue', savedAt: '2026-03-27', lastSeen: '1 month ago', phone: '+95 9 4901 23 45' },
  { id: 'c14', name: 'Myo Min Aung', role: 'Software Architect', company: 'Frontiir', city: 'Yangon', tag: 'Friend', source: 'exchange', accent: 'slate', savedAt: '2026-03-24', lastSeen: '5 weeks ago', email: 'myo@frontiir.com' },
  { id: 'c15', name: 'Hla Hla Tun', role: 'Lawyer', company: 'Tilleke & Gibbins MM', city: 'Yangon', tag: 'Client', source: 'manual', accent: 'rose', savedAt: '2026-03-20', lastSeen: '6 weeks ago', email: 'hlahla@tilleke.mm' },
  { id: 'c16', name: 'Zaw Win Htut', role: 'Logistics Lead', company: 'Wave Logistics', city: 'Mandalay', tag: 'Lead', source: 'ai', accent: 'violet', savedAt: '2026-03-18', lastSeen: '6 weeks ago' },
  { id: 'c17', name: 'Khaing Su', role: 'Pastry Chef', company: 'Sweet Inle Bakery', city: 'Taunggyi', tag: 'Friend', source: 'nearby', accent: 'amber', savedAt: '2026-03-12', lastSeen: '7 weeks ago' },
  { id: 'c18', name: 'Tun Tun Naing', role: 'Photographer', company: 'Frame Yangon', city: 'Yangon', tag: 'Vendor', source: 'scan', accent: 'slate', savedAt: '2026-03-08', lastSeen: '8 weeks ago' },
  { id: 'c19', name: 'Wai Yan', role: 'Investor Relations', company: 'Delta Capital', city: 'Yangon', tag: 'Client', source: 'exchange', accent: 'emerald', savedAt: '2026-03-04', lastSeen: '8 weeks ago' },
  { id: 'c20', name: 'Sandar Oo', role: 'NGO Coordinator', company: 'Save the Children MM', city: 'Yangon', tag: 'Mentor', source: 'manual', accent: 'teal', savedAt: '2026-02-28', lastSeen: '2 months ago', starred: true },
]

export const ALL_TAGS = ['All', 'Lead', 'Client', 'Partner', 'Friend', 'Mentor', 'Vendor'] as const
export const ALL_CITIES = ['All cities', 'Yangon', 'Mandalay', 'Naypyidaw', 'Bagan', 'Taunggyi', 'Pathein'] as const

// ---------- My Cards ----------
export type CardStyle = 'paper' | 'minimal' | 'bold' | 'festival'
export type MyCard = {
  id: string
  name: string
  style: CardStyle
  description: string
  views: number
  saves: number
  shares: number
  isPrimary: boolean
  updatedAt: string
  gradient: string
}

export const MY_CARDS: MyCard[] = [
  {
    id: 'mc1',
    name: 'Standard',
    style: 'paper',
    description: 'Bagan Heritage · Marketing Lead',
    views: 824,
    saves: 142,
    shares: 38,
    isPrimary: true,
    updatedAt: '2026-04-22',
    gradient: 'from-[#5B8DEF] to-[#8B5CF6]',
  },
  {
    id: 'mc2',
    name: 'AI Minimal v3',
    style: 'minimal',
    description: 'Generated 2 days ago · Mono palette',
    views: 412,
    saves: 67,
    shares: 12,
    isPrimary: false,
    updatedAt: '2026-04-25',
    gradient: 'from-[#1A1A1A] to-[#4A4A4A]',
  },
  {
    id: 'mc3',
    name: 'Conference',
    style: 'bold',
    description: 'For Yangon Tech Meetup, Bagan Festival',
    views: 196,
    saves: 31,
    shares: 9,
    isPrimary: false,
    updatedAt: '2026-04-12',
    gradient: 'from-[#F59E0B] to-[#DC2626]',
  },
  {
    id: 'mc4',
    name: 'Personal',
    style: 'festival',
    description: 'Casual / family / friends',
    views: 88,
    saves: 12,
    shares: 4,
    isPrimary: false,
    updatedAt: '2026-03-18',
    gradient: 'from-[#10B981] to-[#5B8DEF]',
  },
]

// ---------- AI Studio ----------
export type AIPreset = 'Minimal' | 'Bold' | 'Pastel' | 'Mono' | 'Festival'

export type AIGeneration = {
  id: string
  title: string
  preset: AIPreset
  createdAt: string
  creditsUsed: number
  status: 'queued' | 'rendering' | 'ready'
  thumbColor: string
}

export const AI_GENERATIONS: AIGeneration[] = [
  { id: 'g1', title: 'Minimal · Marketing v3', preset: 'Minimal', createdAt: '2026-04-25T19:14:00', creditsUsed: 2, status: 'ready', thumbColor: '#1A1A1A' },
  { id: 'g2', title: 'Pastel · Conference', preset: 'Pastel', createdAt: '2026-04-23T11:42:00', creditsUsed: 2, status: 'ready', thumbColor: '#F472B6' },
  { id: 'g3', title: 'Bold · Festival edition', preset: 'Festival', createdAt: '2026-04-20T16:05:00', creditsUsed: 3, status: 'ready', thumbColor: '#F59E0B' },
  { id: 'g4', title: 'Mono · Studio remix', preset: 'Mono', createdAt: '2026-04-18T08:30:00', creditsUsed: 2, status: 'ready', thumbColor: '#4A4A4A' },
  { id: 'g5', title: 'Bold · Outreach v1', preset: 'Bold', createdAt: '2026-04-15T20:11:00', creditsUsed: 3, status: 'ready', thumbColor: '#5B8DEF' },
  { id: 'g6', title: 'Pastel · Casual', preset: 'Pastel', createdAt: '2026-04-13T09:20:00', creditsUsed: 1, status: 'ready', thumbColor: '#A78BFA' },
]

export const AI_PRESETS: { name: AIPreset; description: string; cost: number; tone: string }[] = [
  { name: 'Minimal', description: 'Whitespace, single accent', cost: 2, tone: 'bg-[#F3F3F3] text-[#1A1A1A]' },
  { name: 'Bold', description: 'High contrast, big type', cost: 3, tone: 'bg-[#EEF2FF] text-[#5B8DEF]' },
  { name: 'Pastel', description: 'Soft Myanmar pastels', cost: 2, tone: 'bg-[#FDF2F8] text-[#BE185D]' },
  { name: 'Mono', description: 'Black, grey, type-led', cost: 2, tone: 'bg-[#F5F5F5] text-[#303030]' },
  { name: 'Festival', description: 'Thingyan / Bagan motifs', cost: 3, tone: 'bg-[#FFF7ED] text-[#C2410C]' },
]

// ---------- Analytics ----------
export const CITY_SCANS: { city: string; pct: number; count: number }[] = [
  { city: 'Yangon', pct: 62, count: 888 },
  { city: 'Mandalay', pct: 18, count: 258 },
  { city: 'Naypyidaw', pct: 8, count: 114 },
  { city: 'Bagan', pct: 5, count: 72 },
  { city: 'Taunggyi', pct: 4, count: 57 },
  { city: 'Other', pct: 3, count: 43 },
]

export const SOURCE_BREAKDOWN: { source: string; pct: number; count: number }[] = [
  { source: 'QR scan', pct: 54, count: 773 },
  { source: 'NFC tap', pct: 22, count: 315 },
  { source: 'Share link', pct: 15, count: 215 },
  { source: 'Nearby exchange', pct: 9, count: 129 },
]

export const DEVICE_BREAKDOWN: { device: string; pct: number }[] = [
  { device: 'iOS', pct: 61 },
  { device: 'Android', pct: 39 },
]

export const TOP_CARDS_PERF: { card: string; scans: number; saves: number; saveRate: number }[] = [
  { card: 'Standard', scans: 824, saves: 142, saveRate: 17.2 },
  { card: 'AI Minimal v3', scans: 412, saves: 67, saveRate: 16.3 },
  { card: 'Conference', scans: 196, saves: 31, saveRate: 15.8 },
  { card: 'Personal', scans: 88, saves: 12, saveRate: 13.6 },
]

export const HOURLY_PATTERN: { hour: string; value: number }[] = [
  { hour: '8a', value: 4 },
  { hour: '10a', value: 9 },
  { hour: '12p', value: 14 },
  { hour: '2p', value: 18 },
  { hour: '4p', value: 22 },
  { hour: '6p', value: 17 },
  { hour: '8p', value: 11 },
  { hour: '10p', value: 5 },
]

// ---------- Subscription ----------
export type Plan = {
  id: 'free' | 'pro' | 'business'
  name: string
  pricePerMonth: number
  pricePerYear: number
  features: string[]
  highlight?: boolean
  badge?: string
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Swapo Free',
    pricePerMonth: 0,
    pricePerYear: 0,
    features: [
      '1 digital card',
      '20 AI credits / month',
      'Up to 200 saved contacts',
      'QR + share link',
    ],
  },
  {
    id: 'pro',
    name: 'Swapo Pro',
    pricePerMonth: 9900,
    pricePerYear: 99000,
    features: [
      'Up to 5 digital cards',
      '120 AI credits / month',
      'Unlimited saved contacts',
      'NFC tap-to-share',
      'Custom domain (you.swapo.mm)',
      'Card scan analytics',
    ],
    highlight: true,
    badge: 'Most popular',
  },
  {
    id: 'business',
    name: 'Swapo Business',
    pricePerMonth: 24900,
    pricePerYear: 249000,
    features: [
      'Everything in Pro',
      'Unlimited cards & seats',
      '500 AI credits / month',
      'Team-shared contacts',
      'CSV & Google Contacts sync',
      'Priority Myanmar support',
    ],
  },
]

export type PaymentMethod = 'KBZPay' | 'Wave Pay' | 'AYA Pay' | 'Card' | 'Bank transfer'
export const PAYMENT_METHODS: { name: PaymentMethod; subtitle: string }[] = [
  { name: 'KBZPay', subtitle: 'Most popular in Myanmar' },
  { name: 'Wave Pay', subtitle: 'Instant from Wave Money wallet' },
  { name: 'AYA Pay', subtitle: 'AYA Bank wallet' },
  { name: 'Card', subtitle: 'Visa, Mastercard, JCB' },
  { name: 'Bank transfer', subtitle: 'KBZ, AYA, CB Bank' },
]

export type Invoice = {
  id: string
  date: string
  description: string
  amount: number
  method: PaymentMethod
  status: 'paid' | 'pending' | 'failed'
}

export const INVOICES: Invoice[] = [
  { id: 'INV-2026-04', date: '2026-04-01', description: 'Swapo Pro · Monthly', amount: 9900, method: 'KBZPay', status: 'paid' },
  { id: 'INV-2026-03', date: '2026-03-01', description: 'Swapo Pro · Monthly', amount: 9900, method: 'KBZPay', status: 'paid' },
  { id: 'INV-2026-02', date: '2026-02-01', description: 'Swapo Pro · Monthly', amount: 9900, method: 'Wave Pay', status: 'paid' },
  { id: 'INV-2026-01', date: '2026-01-01', description: 'Swapo Pro · Monthly', amount: 9900, method: 'KBZPay', status: 'paid' },
  { id: 'INV-2025-12', date: '2025-12-01', description: 'Swapo Pro · Monthly', amount: 9900, method: 'KBZPay', status: 'paid' },
]

export const CURRENT_PLAN: 'free' | 'pro' | 'business' = 'pro'

// ---------- Settings ----------
export type Language = { code: 'en' | 'my'; label: string; native: string }
export const LANGUAGES: Language[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'my', label: 'Burmese', native: 'မြန်မာဘာသာ' },
]

export type Appearance = 'system' | 'light' | 'dark'

export type NotificationPref = {
  id: string
  label: string
  description: string
  enabled: boolean
}

export const NOTIFICATION_PREFS: NotificationPref[] = [
  { id: 'np1', label: 'Card was saved', description: 'When someone saves your card', enabled: true },
  { id: 'np2', label: 'Card was scanned', description: 'When your QR or NFC is scanned', enabled: true },
  { id: 'np3', label: 'AI generation ready', description: 'When a generation finishes rendering', enabled: true },
  { id: 'np4', label: 'Trust level updates', description: 'Level-ups, milestones, achievements', enabled: true },
  { id: 'np5', label: 'Nearby exchange invites', description: 'When someone nearby wants to exchange', enabled: false },
  { id: 'np6', label: 'Weekly summary email', description: 'Sent every Monday morning', enabled: true },
  { id: 'np7', label: 'Swapo product updates', description: 'New features, beta invites', enabled: false },
]

export type ConnectedApp = {
  id: string
  name: string
  description: string
  connected: boolean
}

export const CONNECTED_APPS: ConnectedApp[] = [
  { id: 'goog', name: 'Google Contacts', description: 'Two-way sync with your Google account', connected: true },
  { id: 'apple', name: 'Apple Contacts', description: 'Sync with iCloud (iOS only)', connected: true },
  { id: 'outlook', name: 'Outlook', description: 'For Microsoft 365 + Exchange', connected: false },
  { id: 'kbz', name: 'KBZPay', description: 'Used for billing & payments', connected: true },
  { id: 'wave', name: 'Wave Pay', description: 'Alternative payment method', connected: false },
]

// ---------- Notifications panel ----------
export type DashNotification = {
  id: string
  kind: ActivityKind | 'system'
  primary: string
  secondary: string
  date: string
  unread: boolean
}

export const DASH_NOTIFICATIONS: DashNotification[] = [
  { id: 'n1', kind: 'saved', primary: 'Mya Thandar saved your card', secondary: 'Bagan Heritage Co. · Yangon', date: '2026-04-26T15:32:00', unread: true },
  { id: 'n2', kind: 'scanned', primary: '4 people scanned your card', secondary: 'Yangon Tech Meetup', date: '2026-04-26T11:08:00', unread: true },
  { id: 'n3', kind: 'ai-gen', primary: 'AI Minimal v3 is ready', secondary: '2 credits used · view in AI Studio', date: '2026-04-25T19:14:00', unread: false },
  { id: 'n4', kind: 'level-up', primary: 'Trust Level 3 unlocked', secondary: 'Networker · verified profile + 100 saves', date: '2026-04-22T09:30:00', unread: false },
  { id: 'n5', kind: 'system', primary: 'KBZPay payment received', secondary: 'Swapo Pro · April · 9,900 MMK', date: '2026-04-01T08:00:00', unread: false },
]

// ---------- Help & FAQ ----------
export type FAQEntry = { q: string; a: string }
export const FAQ_ENTRIES: FAQEntry[] = [
  { q: 'How does Swapo handle Myanmar phone numbers?', a: 'Swapo auto-formats +95 numbers and recognises both Myanmar and Latin digits when typing.' },
  { q: 'Which payment methods are supported?', a: 'KBZPay, Wave Pay, AYA Pay, plus Visa/Mastercard/JCB and direct bank transfer to KBZ, AYA, or CB Bank.' },
  { q: 'Can I switch between English and မြန်မာ?', a: 'Yes, under Settings → Language. The full UI, including AI prompts, supports both.' },
  { q: 'What happens to my saved contacts if I cancel Pro?', a: 'They stay safe. You keep read-only access; the 200-contact cap only applies to new saves on the Free plan.' },
  { q: 'How do AI credits work?', a: 'Each preset costs 1–3 credits. Credits refresh on your billing date and unused credits do not roll over.' },
  { q: 'Can my whole company use one Swapo account?', a: 'Use Swapo Business. Unlimited cards & seats, shared contacts, CSV sync, and priority Myanmar support.' },
]

export const HELP_LINKS = [
  { title: 'Getting started guide', subtitle: 'Set up your first card in 3 minutes', href: '#' },
  { title: 'NFC tap-to-share', subtitle: 'Pair your phone with NFC stickers', href: '#' },
  { title: 'AI Studio prompts', subtitle: 'Tips for the best Myanmar-style cards', href: '#' },
  { title: 'Contact support', subtitle: 'Reply within 1 business day · Yangon time', href: '#' },
]
