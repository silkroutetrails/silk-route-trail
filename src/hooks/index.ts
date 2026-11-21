import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/** Refresh the public pages after an editor saves content in the admin panel. */
const refresh = () => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Not running inside Next.js (for example the seed script). Safe to ignore.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  refresh()
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  refresh()
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc }) => {
  refresh()
  return doc
}

const line = (label: string, value: unknown) =>
  value === undefined || value === null || value === '' ? '' : `${label}: ${String(value)}\n`

/**
 * Sends two emails when a visitor submits a form:
 * 1) a notification to the team, 2) an acknowledgement to the visitor.
 * A mail failure never blocks the submission itself (the record is already saved).
 */
export const makeNotifyHook =
  (kind: 'enquiry' | 'trip request'): CollectionAfterChangeHook =>
  async ({ doc, operation, req }) => {
    if (operation !== 'create') return doc
    try {
      const settings = await req.payload.findGlobal({ slug: 'site-settings' })
      const team = (settings?.notificationEmail as string) || process.env.NOTIFY_EMAIL
      const subjectTail = doc.name ? ` from ${doc.name}` : ''
      const summary =
        line('Name', doc.name) +
        line('Email', doc.email) +
        line('Phone / WhatsApp', doc.phone) +
        line('Country', doc.country) +
        line('Type', doc.enquiryType) +
        line('Preferred start', doc.preferredStart) +
        line('Preferred end / flexibility', doc.preferredEnd) +
        line('Group size', doc.groupSize) +
        line('Interests', Array.isArray(doc.interests) ? doc.interests.join(', ') : doc.interests) +
        line('Fitness level', doc.fitnessLevel) +
        line('Budget', doc.budget) +
        line('Message', doc.message || doc.notes)

      if (team) {
        await req.payload.sendEmail({
          to: team,
          subject: `New ${kind}${subjectTail}`,
          text: `A new ${kind} was submitted on the website.\n\n${summary}\nOpen it in the admin panel to update its status.`,
        })
      }
      if (doc.email) {
        await req.payload.sendEmail({
          to: doc.email,
          subject: `We received your ${kind} - Silk Route Trails`,
          text:
            `Hello ${doc.name || ''},\n\nThank you for contacting Silk Route Trails. We have received your ${kind} ` +
            `and a member of our team will follow up with you personally.\n\nHere is what you sent us:\n\n${summary}\n` +
            `If anything above needs correcting, just reply to this email.\n\nSilk Route Trails\nAdventure & Heritage Tours`,
        })
      }
    } catch (err) {
      req.payload.logger.error({ err, msg: `Could not send ${kind} emails` })
    }
    return doc
  }
