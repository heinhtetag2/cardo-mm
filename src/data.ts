export type Creation = {
  id: string
  kind: 'card' | 'logo'
  name: string
  role?: string
  industry?: string
  tone?: string
  styleId: string
  variation: number
  prompt?: string
  createdAt: number
}

export type Contact = {
  id: string
  name: string
  role: string
  company: string
  city: string
  phone: string
  email: string
  website?: string
  bio?: string
  metAt?: string
  tags?: string[]
  accent: string
  avatar?: string
}

export const contacts: Contact[] = [
  {
    id: 'c1',
    name: 'Aung Ko Ko',
    role: 'Sales Manager',
    company: 'Logistics MM',
    city: 'Yangon',
    phone: '+95 9 421 887 332',
    email: 'aung.koko@logisticsmm.com',
    website: 'logisticsmm.com',
    bio: 'Building logistics infra across Myanmar. Always open to a coffee chat.',
    metAt: 'Yangon Trade Fair · 2026 Mar',
    tags: ['Lead', 'Logistics'],
    accent: 'from-blue-500/40 to-violet-500/40',
  },
  {
    id: 'c2',
    name: 'Su Su Win',
    role: 'Designer',
    company: 'Studio Maw',
    city: 'Mandalay',
    phone: '+95 9 776 224 901',
    email: 'su@studiomaw.co',
    website: 'studiomaw.co',
    bio: 'Brand identity & packaging. Curious about local craft.',
    metAt: 'Mandalay Design Week · 2026 Feb',
    tags: ['Creative', 'Partner'],
    accent: 'from-pink-500/40 to-orange-400/40',
  },
  {
    id: 'c3',
    name: 'U Thant Zin',
    role: 'Director',
    company: 'Trade Co.',
    city: 'Yangon',
    phone: '+95 9 251 008 446',
    email: 'thantzin@trade.co.mm',
    bio: '20 yrs in cross-border trade. Connects east and west.',
    metAt: 'Naypyidaw Business Forum · 2026 Jan',
    tags: ['Mentor'],
    accent: 'from-emerald-500/40 to-cyan-400/40',
  },
  {
    id: 'c4',
    name: 'Khin Khin',
    role: 'Marketing',
    company: 'AdHouse YGN',
    city: 'Yangon',
    phone: '+95 9 678 412 089',
    email: 'khin@adhouse.mm',
    bio: 'Social-first growth. Shares great memes.',
    metAt: 'Tech Meetup YGN',
    tags: ['Friend'],
    accent: 'from-amber-400/40 to-rose-500/40',
  },
  {
    id: 'c5',
    name: 'Min Aung',
    role: 'Engineer',
    company: 'TechBM',
    city: 'Naypyidaw',
    phone: '+95 9 551 322 778',
    email: 'min@techbm.io',
    bio: 'Backend systems · React Native · OSS contributor',
    metAt: 'DevDay 2026',
    tags: ['Tech'],
    accent: 'from-cyan-400/40 to-blue-500/40',
  },
  {
    id: 'c6',
    name: 'Hnin Yu',
    role: 'Founder',
    company: 'Tea & Co.',
    city: 'Mandalay',
    phone: '+95 9 922 110 553',
    email: 'hnin@teaandco.mm',
    bio: 'Specialty tea house & e-commerce. Always experimenting.',
    metAt: 'F&B Expo · 2026 Mar',
    tags: ['Founder', 'Lead'],
    accent: 'from-violet-500/40 to-fuchsia-500/40',
  },
]

export type Ad = {
  id: string
  title: string
  subtitle: string
  sponsor: string
  href?: string
  image?: string
  accent: string
}

export const ads: Ad[] = [
  {
    id: 'a1',
    title: 'Print premium NFC cards',
    subtitle: 'Tap-to-share, ships in 3 days · 20% off',
    sponsor: 'Swapo Print',
    accent: 'from-brand/25 to-brand-violet/25',
  },
  {
    id: 'a2',
    title: 'Open a business account',
    subtitle: 'Free transfers across Myanmar',
    sponsor: 'KBZ Pay',
    accent: 'from-emerald-500/25 to-cyan-400/25',
  },
  {
    id: 'a3',
    title: 'Yangon Trade Fair 2026',
    subtitle: 'Get your free pass · May 18–20',
    sponsor: 'YTF',
    accent: 'from-amber-400/25 to-rose-500/25',
  },
]

export const me = {
  name: 'Hein Htet',
  role: 'Product Designer',
  company: 'Independent',
  city: 'Yangon',
  phone: '+95 9 123 456 789',
  email: 'hein@swapo.mm',
  website: 'swapo.mm/heinhtet',
  bio: 'Designer building products for Myanmar professionals.',
}

export const account = {
  displayName: 'Hein Htet',
  loginPhoneMasked: '+95 9 •••• 3421',
  recoveryEmail: 'hein@swapo.mm',
  plan: 'free' as 'free' | 'pro',
  credits: 3,
  linked: ['Google'] as Array<'Google' | 'Apple' | 'Facebook'>,
}
