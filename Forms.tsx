'use client'
import { useActionState } from 'react'
import { submitEnquiry, submitTripRequest } from '@/app/(frontend)/actions'
import { initialState, type FormState } from '@/lib/form-state'

function Field({
  label, name, type = 'text', required, error, placeholder, defaultValue, autoComplete, min, max,
}: {
  label: string; name: string; type?: string; required?: boolean; error?: string; placeholder?: string
  defaultValue?: string; autoComplete?: string; min?: number; max?: number
}) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}{required && <span className="text-amber-deep"> *</span>}</label>
      <input
        id={name} name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue}
        autoComplete={autoComplete} min={min} max={max} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-err` : undefined}
        className={`field ${error ? 'border-red-500' : ''}`}
      />
      {error && <p id={`${name}-err`} className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  )
}

function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
    </div>
  )
}

function Status({ state }: { state: FormState }) {
  if (!state.message) return null
  return (
    <p
      role={state.ok ? 'status' : 'alert'}
      className={`rounded-xl px-4 py-3 text-sm font-semibold ${state.ok ? 'bg-teal/10 text-teal' : 'bg-red-50 text-red-800'}`}
    >
      {state.message}
    </p>
  )
}

export function EnquiryForm({
  tourSlug, tourTitle, enquiryType = 'general', messagePlaceholder,
}: { tourSlug?: string; tourTitle?: string; enquiryType?: 'general' | 'tour' | 'corporate'; messagePlaceholder?: string }) {
  const [state, action, pending] = useActionState(submitEnquiry, initialState)
  const e = state.errors ?? {}
  if (state.ok && !state.errors) {
    return <div className="rounded-2xl border border-teal/30 bg-teal/5 p-6"><Status state={state} /></div>
  }
  return (
    <form action={action} className="relative space-y-4" noValidate>
      <input type="hidden" name="enquiryType" value={tourSlug ? 'tour' : enquiryType} />
      {tourSlug && <input type="hidden" name="tour" value={tourSlug} />}
      {tourTitle && <p className="rounded-xl bg-snow px-4 py-3 text-sm">Enquiring about: <strong>{tourTitle}</strong></p>}
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="name" required error={e.name} autoComplete="name" />
        <Field label="Email" name="email" type="email" required error={e.email} autoComplete="email" />
        <Field label="Phone / WhatsApp" name="phone" type="tel" autoComplete="tel" />
        <Field label="Country or city" name="country" />
      </div>
      <div>
        <label htmlFor="message" className="label">Your message <span className="text-amber-deep">*</span></label>
        <textarea
          id="message" name="message" rows={5} required placeholder={messagePlaceholder ?? 'Tell us what you have in mind: dates, group size, anything we should know.'}
          aria-invalid={Boolean(e.message)} className={`field ${e.message ? 'border-red-500' : ''}`}
        />
        {e.message && <p className="mt-1 text-sm text-red-700">{e.message}</p>}
      </div>
      <Status state={state} />
      <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">{pending ? 'Sending...' : 'Send enquiry'}</button>
    </form>
  )
}

const INTERESTS = [
  ['trekking', 'Trekking'], ['heritage', 'Heritage and culture'], ['photography', 'Photography'],
  ['valleys', 'Lakes and valleys'], ['family', 'Family trip'], ['corporate', 'Corporate retreat'],
]

export function TripRequestForm() {
  const [state, action, pending] = useActionState(submitTripRequest, initialState)
  const e = state.errors ?? {}
  if (state.ok && !state.errors) {
    return <div className="rounded-2xl border border-teal/30 bg-teal/5 p-6"><Status state={state} /></div>
  }
  return (
    <form action={action} className="relative space-y-6" noValidate>
      <Honeypot />
      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-semibold">About you</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name" name="name" required error={e.name} autoComplete="name" />
          <Field label="Email" name="email" type="email" required error={e.email} autoComplete="email" />
          <Field label="Phone / WhatsApp" name="phone" type="tel" autoComplete="tel" />
          <Field label="Where are you travelling from?" name="country" placeholder="City and country" />
        </div>
      </fieldset>
      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-semibold">Your trip</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Preferred dates" name="preferredStart" required error={e.preferredStart} placeholder="e.g. July 2027 or 10 to 20 July" />
          <Field label="End date or how flexible you are" name="preferredEnd" placeholder="e.g. flexible by a week" />
          <Field label="Group size" name="groupSize" type="number" min={1} max={200} error={e.groupSize} />
          <div>
            <label htmlFor="fitnessLevel" className="label">Fitness level</label>
            <select id="fitnessLevel" name="fitnessLevel" className="field" defaultValue="">
              <option value="">Select one</option>
              <option value="relaxed">Relaxed (easy walks only)</option>
              <option value="active">Active (a few hours of walking a day)</option>
              <option value="strong">Strong (multi-day treks)</option>
              <option value="expedition">Expedition ready (high altitude experience)</option>
            </select>
          </div>
        </div>
        <div>
          <p className="label">Interests</p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(([v, l]) => (
              <label key={v} className="cursor-pointer">
                <input type="checkbox" name="interests" value={v} className="peer sr-only" />
                <span className="chip border border-line px-4 py-2 text-sm peer-checked:border-teal peer-checked:bg-teal peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-amber">{l}</span>
              </label>
            ))}
          </div>
        </div>
        <Field label="Budget (optional)" name="budget" placeholder="Per person or for the group, in PKR or USD" />
        <div>
          <label htmlFor="notes" className="label">Anything else we should know</label>
          <textarea id="notes" name="notes" rows={4} className="field" placeholder="Special occasions, mobility needs, places you have always wanted to see." />
        </div>
      </fieldset>
      <Status state={state} />
      <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">{pending ? 'Sending...' : 'Send trip request'}</button>
      <p className="text-xs text-muted">We use your details only to reply to your request.</p>
    </form>
  )
}
