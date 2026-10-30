# NEXA Advisory & Consulting — Website

A fast, fully static website. **No backend, no database, no admin panel, no logins.**
Every change is made in code, committed to GitHub, and Netlify rebuilds the site automatically.
Zero dependencies: only Node 20+ is needed to build (`node build.mjs`).

## Where to change things
| What | File |
|---|---|
| Company details (email, phone/WhatsApp, coverage line, social links), services, industries, FAQs, process steps | `src/data.mjs` |
| **Blog** | Hosted on Blogger at blog.nexa.com.np (`company.blog` in `src/data.mjs`); latest posts appear on the home page |
| **Appointment booking** (Calendly links) | `company.booking` in `src/data.mjs`; page built from `src/booking.mjs` |
| **Job vacancies** | `src/content/jobs.mjs` (instructions + template inside) |
| Page layouts and copy for Home, About, Why NEXA, Outsourcing, Contact, legal pages | `build.mjs` |
| Header (mega menus + search), footer, CTA band | `src/lib.mjs` |
| Logo and hero-image links | `src/content/media.mjs` |
| **Home hero statistics and testimonials carousel** | `src/content/social-proof.mjs` (instructions inside) |
| Reusable inner-page sections (stat band, steps, FAQ, comparison, standards…) and shared copy | `src/blocks.mjs` |
| Colours, fonts, spacing, components | `public/assets/css/site.css` (design tokens at the top) |
| Social links in footer | `company.social` in `src/data.mjs` (https:// URLs; blank = hidden) |
| Photos | drop files in `public/assets/img/` (see below) |

### Design system
The home page is the reference design. Its styles live in the *Home reference design* and *v2 design layer* sections at the bottom of `site.css` and are shared by every page (hero, cards, CTA band, footer, WhatsApp button). Inner pages use the same navy/gold hero via `pageHero()` and the CTA band via `ctaBand()` in `src/lib.mjs`. The header is transparent over the hero and turns frosted navy on scroll.

### Photos (optional)
`hero-mountain.jpg` (home hero, already included and compressed) is required by the home hero. 
No stock photos are bundled (none were licensed). Branded illustrations are used instead. Add your own licensed images
with these exact names and they replace the illustrations automatically:
`about-nexa.jpg`, `outsourcing-remote.jpg`, `workflow-collaboration.jpg` (all ~1200×900; home page), `about.jpg`, `industry-<slug>.jpg` (e.g. `industry-sme.jpg`). Until they exist, the home page shows a branded caption panel instead.
Replace `public/assets/img/og.png` (1200×630) for link previews.

## Local use
```
node build.mjs          # builds ./dist
node scripts/verify.mjs # offline QA: links, SEO tags, forms, JSON-LD
```
Open `dist/index.html` through any static server (e.g. `npx serve dist`) to preview.

## Deploy (GitHub → Netlify)
1. Push this folder to GitHub.
2. Netlify → site `nexa-web-app` → Project configuration → Build & deploy → Link repository.
   Build command `node build.mjs`, publish directory `dist` (already in `netlify.toml`).
3. **Turn off SSO/password protection** (Project configuration → Access & security), otherwise visitors hit a login wall.
4. **Forms use Formspree** (endpoint `https://formspree.io/f/mpqvnlnb`, set once as `FORMSPREE` in `build.mjs`). Nothing to enable in Netlify.
   Forms: `contact`, `outsourcing` and (when a vacancy exists) `job-application`; each is tagged in the email subject. Manage notifications, spam filtering and the allowed domain in your Formspree dashboard.
5. Domain: choose one primary domain under Domain management (www.nexa.com.np recommended; canonical tags use www). Do not add a manual redirect on top.
6. After the first deploy, **send a test message** from /contact, /outsourcing and a test application to confirm they arrive.

## Notes
- Form spam protection uses Formspree’s `_gotcha` honeypot; add reCAPTCHA in the Formspree dashboard for stronger protection.
- **CV uploads need a Formspree plan that supports file uploads.** On a plan without it, the job-application form will show an error; check your plan before publishing vacancies. The form accepts PDF/DOC/DOCX up to 5 MB.
- The Privacy Policy and FAQs name Formspree as the form processor. Keep them in sync if you change provider.

## Logo, hero images, social links, search
- **Logo + hero images:** paste links in `src/content/media.mjs` (instructions inside). Empty = reserved space / default “N” mark. The name “NEXA Advisory & Consulting” is fixed text beside the logo.
- **Social links and WhatsApp number:** `company.social`, `company.phone` and `company.whatsapp` (the same single number) in `src/data.mjs`. They feed the footer, top bar, mobile menu, contact page, CTA bands and structured data (`sameAs`).
- **Brand icons** come from Simple Icons (CC0) and Font Awesome Free (LinkedIn, CC BY 4.0), see `src/brands.mjs`.
- **Search:** the header search (press `/` or Ctrl/Cmd+K) reads `/assets/search-index.json`, generated on every build from services, industries, FAQs, pages, the latest blog posts and vacancies. Services, Industries, FAQs, Blog and Careers also have on-page search + filters.
- Vacancies disappear in visitors’ browsers after their `deadline`, and are removed fully on the next deploy.
- The previous Supabase project was left untouched and is no longer used by the website. You may pause or delete it yourself when ready.
- Legal pages are drafts that need review by a qualified adviser (state real retention periods).
- Do not add statistics, testimonials, certifications or client logos unless verified.
- **Testimonials are currently SAMPLES.** The home-page carousel ships with six placeholder quotes (anonymous, no company names) so the layout can be previewed; a small caption on the page says so. Replace them in `src/content/social-proof.mjs` with real, permission-checked feedback, then set `testimonialsAreSamples = false`. `node scripts/verify.mjs` prints a reminder until you do. No review/rating structured data is generated.
- **Hero statistics** default to facts derived from the site itself (number of services, sectors, process steps), so they are always accurate. Add business figures (clients, years) only once verified; see the examples in `social-proof.mjs`.


## Booking, blog, contact details (v6)
- **Booking:** `/book` offers Physical, Group and One-on-One meetings (Calendly). The calendar is created only after a visitor picks a meeting type, so Calendly loads nothing until then. Links are validated at build time and only calendly.com links are allowed. Deep link: `/book?type=physical|group|one-on-one#calendar`. Every “Book a Consultation” button points to `/book`.
- **Blog:** the blog lives on Blogger (`https://blog.nexa.com.np`). `/blog` redirects there (301 in `netlify.toml`, plus a fallback redirect page for other hosts). The home page shows the 3 latest posts, fetched from the Blogger feed **at build time** (posts update when the site rebuilds: push a commit, or set a Netlify build hook / scheduled build). If the feed cannot be reached, the build continues and a “Visit our blog” card is shown. Blogger must have HTTPS enabled for the custom domain (this site sends an HSTS header that includes subdomains).
- **No address anywhere:** the site shows only “Serving clients all over Nepal and globally” (`company.coverage`). `node scripts/verify.mjs` fails the build if an address, a second phone number, another @nexa.com.np email or an unknown Calendly link appears.
- **Contact details:** the only phone/WhatsApp number is `company.phone`; the only email is `company.email`.
- **Images:** originals live in `source-images/` (not deployed); optimised WebP versions are used on the site (`src/content/media.mjs`).
