export type Img = { url: string; alt: string }

export type Destination = {
  slug: string
  name: string
  region: string
  location: string
  summary: string
  description: string
  highlights: string[]
  cover: Img | null
  photos: Img[]
  featured: boolean
}

export type Tour = {
  slug: string
  title: string
  kind: 'getaway' | 'expedition'
  destinationSlug: string | null
  destinationName: string | null
  summary: string
  description: string
  durationDays: number
  difficulty: 'easy' | 'moderate' | 'challenging' | 'demanding'
  months: number[]
  seasonNote: string
  highlights: string[]
  itinerary: { title: string; description: string }[]
  inclusions: string[]
  exclusions: string[]
  priceOnRequest: boolean
  priceFrom: number | null
  priceCurrency: string
  priceNote: string
  cover: Img | null
  photos: Img[]
  featured: boolean
}

export type GalleryItem = { id: string; image: Img; caption: string; destinationName: string | null }

export type SeasonRow = { place: string; region: string; note: string; levels: number[] }

export type InfoItem = { title: string; category: string; audience: string; body: string }

export type Faq = { question: string; answer: string; category: string }

export type Settings = {
  whatsappNumber: string
  contactEmail: string
  phone: string
  officeAddress: string
  officeHours: string
  licences: { label: string; value: string }[]
  instagram: string
  facebook: string
  youtube: string
}

export const REGION_LABELS: Record<string, string> = {
  'gilgit-baltistan': 'Gilgit-Baltistan',
  chitral: 'Chitral',
  'khyber-pakhtunkhwa': 'Khyber Pakhtunkhwa',
  'punjab-islamabad': 'Punjab / Islamabad',
  'azad-kashmir': 'Azad Kashmir',
  other: 'Other',
}

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  challenging: 'Challenging',
  demanding: 'Demanding',
}

export const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const MONTH_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
