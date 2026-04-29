import { useEffect, useState } from 'react'

export type ThemePref = 'system' | 'dark' | 'light'
type Resolved = 'dark' | 'light'

const STORAGE_KEY = 'cardo:theme'

function resolve(pref: ThemePref): Resolved {
  if (pref === 'system') {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }
  return pref
}

function apply(resolved: Resolved) {
  if (typeof document === 'undefined') return
  if (resolved === 'light') document.documentElement.setAttribute('data-theme', 'light')
  else document.documentElement.removeAttribute('data-theme')
}

export function useTheme() {
  const [pref, setPref] = useState<ThemePref>(() => {
    if (typeof window === 'undefined') return 'dark'
    return (localStorage.getItem(STORAGE_KEY) as ThemePref) || 'dark'
  })

  useEffect(() => {
    apply(resolve(pref))
    if (pref !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const handler = () => apply(resolve('system'))
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [pref])

  const update = (next: ThemePref) => {
    setPref(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  return { theme: pref, setTheme: update }
}
