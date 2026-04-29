export type LocationOption = {
  id: string
  name: string
  region: string
  kind?: 'city' | 'street'
}

const MYANMAR_LOCATIONS: LocationOption[] = [
  // Streets (commercial corridors, common on business cards)
  { id: 'st-pyay-sanchaung', name: 'Pyay Road', region: 'Sanchaung, Yangon', kind: 'street' },
  { id: 'st-pyay-bahan', name: 'Pyay Road', region: 'Bahan, Yangon', kind: 'street' },
  { id: 'st-pyay-hlaing', name: 'Pyay Road', region: 'Hlaing, Yangon', kind: 'street' },
  { id: 'st-bogyoke', name: 'Bogyoke Aung San Road', region: 'Pabedan, Yangon', kind: 'street' },
  { id: 'st-strand', name: 'Strand Road', region: 'Kyauktada, Yangon', kind: 'street' },
  { id: 'st-anawrahta', name: 'Anawrahta Road', region: 'Pabedan, Yangon', kind: 'street' },
  { id: 'st-mahabandoola', name: 'Mahabandoola Road', region: 'Kyauktada, Yangon', kind: 'street' },
  { id: 'st-sule', name: 'Sule Pagoda Road', region: 'Kyauktada, Yangon', kind: 'street' },
  { id: 'st-pansodan', name: 'Pansodan Street', region: 'Kyauktada, Yangon', kind: 'street' },
  { id: 'st-shwedagon', name: 'Shwedagon Pagoda Road', region: 'Dagon, Yangon', kind: 'street' },
  { id: 'st-kabaraye', name: 'Kabar Aye Pagoda Road', region: 'Bahan, Yangon', kind: 'street' },
  { id: 'st-uwisara', name: 'U Wisara Road', region: 'Dagon, Yangon', kind: 'street' },
  { id: 'st-dhammazedi', name: 'Dhammazedi Road', region: 'Bahan, Yangon', kind: 'street' },
  { id: 'st-inya', name: 'Inya Road', region: 'Kamayut, Yangon', kind: 'street' },
  { id: 'st-insein', name: 'Insein Road', region: 'Hlaing, Yangon', kind: 'street' },
  { id: 'st-min-ye-kyaw-swar', name: 'Min Ye Kyaw Swar Road', region: 'Lanmadaw, Yangon', kind: 'street' },
  { id: 'st-thirimingalar', name: 'Thirimingalar Road', region: 'Sanchaung, Yangon', kind: 'street' },
  { id: 'st-mdy-26', name: '26th Street', region: 'Chanayethazan, Mandalay', kind: 'street' },
  { id: 'st-mdy-73', name: '73rd Street', region: 'Mahaaungmyay, Mandalay', kind: 'street' },
  { id: 'st-mdy-80', name: '80th Street', region: 'Chanayethazan, Mandalay', kind: 'street' },
  { id: 'st-mdy-35', name: '35th Street', region: 'Chanayethazan, Mandalay', kind: 'street' },
  { id: 'st-mdy-lashio', name: 'Mandalay–Lashio Road', region: 'Mandalay Region', kind: 'street' },
  { id: 'st-bagan-anawrahta', name: 'Anawrahta Road', region: 'Old Bagan', kind: 'street' },
  { id: 'st-bagan-yarkinnthar', name: 'Yarkinnthar Road', region: 'Nyaung U, Bagan', kind: 'street' },
  { id: 'st-npt-yazathingaha', name: 'Yaza Thingaha Road', region: 'Naypyidaw', kind: 'street' },

  // Cities & townships
  { id: 'yangon', name: 'Yangon', region: 'Yangon Region' },
  { id: 'mandalay', name: 'Mandalay', region: 'Mandalay Region' },
  { id: 'naypyidaw', name: 'Naypyidaw', region: 'Union Territory' },
  { id: 'bago', name: 'Bago', region: 'Bago Region' },
  { id: 'mawlamyine', name: 'Mawlamyine', region: 'Mon State' },
  { id: 'taunggyi', name: 'Taunggyi', region: 'Shan State' },
  { id: 'pathein', name: 'Pathein', region: 'Ayeyarwady Region' },
  { id: 'monywa', name: 'Monywa', region: 'Sagaing Region' },
  { id: 'meiktila', name: 'Meiktila', region: 'Mandalay Region' },
  { id: 'sittwe', name: 'Sittwe', region: 'Rakhine State' },
  { id: 'myitkyina', name: 'Myitkyina', region: 'Kachin State' },
  { id: 'lashio', name: 'Lashio', region: 'Shan State' },
  { id: 'pyay', name: 'Pyay', region: 'Bago Region' },
  { id: 'hpa-an', name: 'Hpa-An', region: 'Kayin State' },
  { id: 'magway', name: 'Magway', region: 'Magway Region' },
  { id: 'dawei', name: 'Dawei', region: 'Tanintharyi Region' },
  { id: 'pyin-oo-lwin', name: 'Pyin Oo Lwin', region: 'Mandalay Region' },
  { id: 'bagan', name: 'Bagan', region: 'Mandalay Region' },
  { id: 'inle', name: 'Inle Lake', region: 'Shan State' },
  { id: 'kalaw', name: 'Kalaw', region: 'Shan State' },
  { id: 'kyaukse', name: 'Kyaukse', region: 'Mandalay Region' },
  { id: 'thaton', name: 'Thaton', region: 'Mon State' },
  { id: 'myeik', name: 'Myeik', region: 'Tanintharyi Region' },
  { id: 'kawthaung', name: 'Kawthaung', region: 'Tanintharyi Region' },
  { id: 'loikaw', name: 'Loikaw', region: 'Kayah State' },
  { id: 'hakha', name: 'Hakha', region: 'Chin State' },
  // Yangon townships (most common business locations)
  { id: 'yangon-downtown', name: 'Downtown Yangon', region: 'Yangon · Kyauktada' },
  { id: 'yangon-bahan', name: 'Bahan', region: 'Yangon Region' },
  { id: 'yangon-sanchaung', name: 'Sanchaung', region: 'Yangon Region' },
  { id: 'yangon-hlaing', name: 'Hlaing', region: 'Yangon Region' },
  { id: 'yangon-kamayut', name: 'Kamayut', region: 'Yangon Region' },
  { id: 'yangon-mayangone', name: 'Mayangone', region: 'Yangon Region' },
  { id: 'yangon-yankin', name: 'Yankin', region: 'Yangon Region' },
  { id: 'yangon-thingangyun', name: 'Thingangyun', region: 'Yangon Region' },
  { id: 'yangon-insein', name: 'Insein', region: 'Yangon Region' },
]

export const POPULAR_LOCATIONS: LocationOption[] = [
  MYANMAR_LOCATIONS[0], // Yangon
  MYANMAR_LOCATIONS[1], // Mandalay
  MYANMAR_LOCATIONS[2], // Naypyidaw
  MYANMAR_LOCATIONS[5], // Taunggyi
  MYANMAR_LOCATIONS[17], // Bagan
]

// Swap this implementation for Google Places Autocomplete later.
// Keep the signature: (query) => LocationOption[]
export function searchLocations(query: string): LocationOption[] {
  const q = query.trim().toLowerCase()
  if (!q) return MYANMAR_LOCATIONS.filter((l) => l.kind !== 'street')
  return MYANMAR_LOCATIONS.filter(
    (l) => l.name.toLowerCase().includes(q) || l.region.toLowerCase().includes(q),
  )
}
