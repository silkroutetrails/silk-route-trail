'use server'

import { headers } from 'next/headers'
import { getClient, isPreview } from '@/lib/data'
import type { FormState } from '@/lib/form-state'


// Light protection against floods. Best effort only (each server instance keeps its own counter).
const hits = new Map<string, number[]>()
const limited = (ip: string) => {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 6
}

const str = (fd: FormData, k: string, max = 4000) => String(fd.get(k) ?? '').trim().slice(0, max)
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

async function guard(fd: FormData): Promise<FormState | null> {
  // Hidden "website" field: people never fill it in, bots usually do.
  if (str(fd, 'website')) return { ok: true, message: 'Thank you. We will be in touch soon.' }
  const h = await headers()
  const ip = (h.get('x-forwarded-for') || 'unknown').split(',')[0].trim()
  if (limited(ip)) return { ok: false, message: 'Too many submissions from this connection. Please try again in a few minutes.' }
  return null
}

const previewNote: FormState = {
  ok: true,
  message: 'Preview mode: the form works, but nothing was saved because no database is connected yet.',
}

export async function submitEnquiry(_prev: FormState, fd: FormData): Promise<FormState> {
  const blocked = await guard(fd)
  if (blocked) return blocked

  const name = str(fd, 'name', 120)
  const email = str(fd, 'email', 200)
  const message = str(fd, 'message')
  const errors: Record<string, string> = {}
  if (name.length < 2) errors.name = 'Please enter your name.'
  if (!emailOk(email)) errors.email = 'Please enter a valid email address.'
  if (message.length < 10) errors.message = 'Please tell us a little more (at least 10 characters).'
  if (Object.keys(errors).length) return { ok: false, message: 'Please check the highlighted fields.', errors }
  if (isPreview) return previewNote

  try {
    const payload = await getClient()
    const tourSlug = str(fd, 'tour', 200)
    let tourId: string | undefined
    if (tourSlug) {
      const t = await payload.find({ collection: 'tours', where: { slug: { equals: tourSlug } }, limit: 1, depth: 0 })
      tourId = t.docs[0]?.id as string | undefined
    }
    const type = str(fd, 'enquiryType', 20)
    await payload.create({
      collection: 'enquiries',
      data: {
        name,
        email,
        phone: str(fd, 'phone', 40),
        country: str(fd, 'country', 80),
        enquiryType: ['general', 'tour', 'corporate'].includes(type) ? type : 'general',
        tour: tourId,
        message,
      },
    })
    return { ok: true, message: 'Thank you. Your enquiry has been received and we have emailed you a confirmation. We will follow up personally.' }
  } catch (err) {
    console.error('Enquiry failed', err)
    return { ok: false, message: 'Sorry, something went wrong on our side. Please try again, or contact us on WhatsApp.' }
  }
}

export async function submitTripRequest(_prev: FormState, fd: FormData): Promise<FormState> {
  const blocked = await guard(fd)
  if (blocked) return blocked

  const name = str(fd, 'name', 120)
  const email = str(fd, 'email', 200)
  const groupRaw = str(fd, 'groupSize', 6)
  const groupSize = groupRaw ? Number(groupRaw) : undefined
  const errors: Record<string, string> = {}
  if (name.length < 2) errors.name = 'Please enter your name.'
  if (!emailOk(email)) errors.email = 'Please enter a valid email address.'
  if (!str(fd, 'preferredStart', 60)) errors.preferredStart = 'Tell us roughly when you would like to travel.'
  if (groupSize !== undefined && (!Number.isInteger(groupSize) || groupSize < 1 || groupSize > 200))
    errors.groupSize = 'Enter a whole number between 1 and 200.'
  if (Object.keys(errors).length) return { ok: false, message: 'Please check the highlighted fields.', errors }
  if (isPreview) return previewNote

  const allowedInterests = ['trekking', 'heritage', 'photography', 'valleys', 'family', 'corporate']
  const allowedFitness = ['relaxed', 'active', 'strong', 'expedition']
  const fitness = str(fd, 'fitnessLevel', 20)
  try {
    const payload = await getClient()
    await payload.create({
      collection: 'trip-requests',
      data: {
        name,
        email,
        phone: str(fd, 'phone', 40),
        country: str(fd, 'country', 80),
        preferredStart: str(fd, 'preferredStart', 60),
        preferredEnd: str(fd, 'preferredEnd', 120),
        groupSize,
        interests: fd.getAll('interests').map(String).filter((i) => allowedInterests.includes(i)),
        fitnessLevel: allowedFitness.includes(fitness) ? fitness : undefined,
        budget: str(fd, 'budget', 80),
        notes: str(fd, 'notes'),
      },
    })
    return { ok: true, message: 'Thank you. Your trip request has been received and we have emailed you a confirmation. We will come back with ideas.' }
  } catch (err) {
    console.error('Trip request failed', err)
    return { ok: false, message: 'Sorry, something went wrong on our side. Please try again, or contact us on WhatsApp.' }
  }
}
