# Silk Route Trails website

Next.js 16 + Payload CMS 3 + MongoDB. The public website and the admin panel run together as one application.
Live site connected to the database.
## What is here

| Part | Where |
| --- | --- |
| 11 public pages (Home, About, Destinations, Tours & Expeditions, Tour Details, Gallery, Plan Your Trip, Seasonal Calendar, Permits & Requirements, Corporate Retreats, FAQs, Contact) | `src/app/(frontend)` |
| Admin panel (at `/admin`) | built into Payload |
| Content models | `src/collections`, `src/globals` |
| Enquiry and Plan Your Trip forms (saved to the database, emailed to you, acknowledgement emailed to the visitor) | `src/app/(frontend)/actions.ts`, `src/components/Forms.tsx`, `src/hooks` |
| WhatsApp button | `src/components/WhatsAppButton.tsx` (hidden until a number is added in Site Settings) |
| Sample content | `src/lib/sample.ts` |

## See it on your computer in 2 minutes (no database needed)

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without a database the site runs in **preview mode** with sample content, a yellow banner appears, and forms do not save.

## Go live: checklist

1. **MongoDB.** Create a free cluster at MongoDB Atlas, create a database user, and allow network access (Vercel uses changing addresses, so Atlas needs "allow from anywhere" or the Vercel integration). Copy the connection string.
2. **Copy `.env.example` to `.env`** and fill in `DATABASE_URI` and `PAYLOAD_SECRET` (generate with `openssl rand -hex 32`). Set `NEXT_PUBLIC_SITE_URL` to your real address.
3. **Load the sample content (optional):** `npm run seed`. It refuses to run if content already exists.
4. **Run it:** `npm run dev`, open `/admin`, and create the first account. **The first account becomes the Super Admin.** Add colleagues later under Users (role: Editor).
5. **Fill in Admin > Site Settings:** WhatsApp number (digits only, e.g. 923001234567), email, phone, address, and any licences actually issued. Nothing appears in the footer until you add it.
6. **Replace the sample content** (below) with your own itineraries, photos and permit information.
7. **Email.** Add your SMTP details (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM_ADDRESS`) and set the notification address in Site Settings or `NOTIFY_EMAIL`. Without SMTP, emails are only printed in the server log. Send yourself a test enquiry before launch.
8. **Photos on Vercel.** Vercel's disk is wiped on every deploy, so uploaded photos need cloud storage. Create a Vercel Blob store (Storage tab), connect it to the project, and `BLOB_READ_WRITE_TOKEN` is added automatically. The code already uses it when the token exists. (The proposal also mentions Cloudinary; that needs a different plugin, so ask your developer if you specifically want it.)
9. **Deploy.** Push this folder to a Git repository, import it in Vercel, add the same environment variables, deploy, and attach your domain.

## Replace before launch

Everything in `src/lib/sample.ts` is placeholder text written for layout: 5 destinations, 8 journeys (4 Getaways, 4 Expeditions), seasonal ratings, permit notes and FAQs. Journeys are marked "Indicative itinerary, to be confirmed". No prices, reviews or statistics are included. Photos show generated mountain art until you upload real images.

Check these especially, because the website states them as fact to visitors:

- Itineraries, durations and difficulty ratings
- Seasonal calendar ratings
- Everything on the Permits & Requirements page, including visa, restricted-area and mountaineering permit notes. Confirm each against current official requirements for your licence and routes.
- Licence numbers (add only what has been issued)

## Everyday use (admin)

- **Tours / Destinations:** add, edit, reorder (smaller "order" first), hide by unticking Published, feature on the home page by ticking Featured.
- **Inbox:** new enquiries and custom trip requests appear under Enquiries and Custom Trip Requests. Change the status as you work them and add internal notes.
- Edits appear on the public site within about a minute.

## Security notes

- Passwords are handled by Payload (hashed, lockout after 5 failed attempts, 12-hour sessions).
- Visitors can only create enquiries; only signed-in staff can read them.
- Forms include a hidden spam trap and a basic per-connection limit.
- Keep `PAYLOAD_SECRET` private and never commit `.env`.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run seed` | Load sample content into an empty database |
| `npm run typecheck` | Type check |
