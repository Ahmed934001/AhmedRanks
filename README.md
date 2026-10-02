# Ahmed Ranks — Liquid-Glass Digital Marketing Agency Website

Production-ready, multi-page, SEO-optimized website for **Ahmed Ranks** (digital marketing agency, Karachi, Pakistan).
Built with **Bootstrap 5.3.7 · GSAP 3.13 + ScrollTrigger · Font Awesome 6.7.2 · Fancybox 5 · Swiper 11 · Toastify · canvas-confetti** — styled as an iOS 26-inspired *liquid glass* design system.

## 📁 Structure
```
ahmed-ranks/
├── index.html        # Homepage (hero, services, process, cases, gallery, LinkedIn band,
│                     #   testimonials, pricing + countdown, founder, FAQ, CTA, contact)
├── about.html        # Founder profile: summary, competencies, certifications, timeline, values
├── services.html     # 8 deep service blocks + "how to choose an agency" SEO long-form block
├── portfolio.html    # 3 full case studies (challenge → action → result) + engagement gallery
├── css/style.css     # Complete liquid-glass design system (tokens, glass, animations, responsive)
├── js/main.js        # Nav, GSAP reveals, counters, rotator, tilt/sheen, countdown, confetti,
│                     #   Toastify social proof, gallery filters, Fancybox, Swiper, form→WhatsApp
├── js/chatbot.js     # RankBot conversion chatbot (adaptive chips, objection handling,
│                     #   mandated end-message + tap-to-call support card)
├── robots.txt
├── sitemap.xml
└── assets/logo.png   # Brand logo (also favicon)
```

## 🚀 Run locally
```bash
cd ahmed-ranks
python3 -m http.server 8000      # or: npx serve
# open http://localhost:8000
```

## 🎨 Design tokens (as briefed)
| Token | Hex | Use |
|---|---|---|
| Deep Slate / Charcoal | `#1E293B` | Primary brand base, dark sections |
| Emerald Green | `#059669` | Accent & action color (CTAs, badges, progress) |
| Cool Muted Gray | `#94A3B8` | Sub-headings, card borders, metadata |
| Ice White | `#F1F5F9` | Backgrounds & light glass cards |
| Signature gradient | emerald → teal → sky | Mirrors the AR logo; headings, buttons, bars |

Typography: **Plus Jakarta Sans** (headings) + **Inter** (body).

## 🔍 SEO implementation
- Unique `<title>` + meta description per page (keyword-led, CTA-included)
- Primary keywords targeted: *digital marketing agency, web development company, linkedin profile optimization, performance marketing agency* + secondary set (SEO optimization Karachi, WordPress development, lead generation, UI UX design, social media marketing, graphic designing, Agile project management, Meta/Google ads, personal branding…)
- Single H1 per page, logical H2–H5 hierarchy, keyword-rich alt attributes
- JSON-LD schema: `ProfessionalService/LocalBusiness` (geo, hours, offer catalog, aggregateRating), `Person` (PMP credential #4389638), `WebSite`, `WebPage`, `FAQPage`, `BreadcrumbList`, `CollectionPage` + `ItemList` of `Service`/`CreativeWork`
- Open Graph + Twitter cards, canonical URLs, geo meta tags, robots.txt + sitemap.xml
- Internal linking: nav ↔ sections ↔ service anchors ↔ case studies ↔ footer

## ⚙️ Conversion & engagement features
- Sticky glass navbar + **Call Us** button (navbar, hero, CTA bands, footer)
- Floating **WhatsApp** button (bottom-left) with pulse ring; **vibrating call button** above it
- **RankBot chatbot** (bottom-right): adaptive suggestion chips per revealed preference,
  marketing logic (anchoring, scarcity, social proof, loss aversion, objection handling),
  ends with *"This conversation has been ended. Please contact our customer support for more
  details."* + tap-to-call support card
- **Toastify** social-proof purchase notifications (bottom-center) with 🇵 🇮🇳 🇸 🇦 names
- **Confetti** celebration on load + on pricing/CTA clicks
- Evergreen **48-hour discount countdown** (announcement bar + pricing), persisted per visitor
- Fancybox gallery (images + YouTube showreel video), Swiper testimonial slider,
  GSAP scroll reveals / parallax / 3D tilt + cursor sheen on glass cards
- Lead form routes to WhatsApp with pre-filled context (zero lost leads)
- Mobile-first responsive, `prefers-reduced-motion` respected, skip-link + ARIA labels

## 📞 Business data wired in
- Phone: `0334 3706275` → `tel:+923343706275` · WhatsApp `wa.me/923343706275`
- Email: `ahmedranks@gmail.com` · Location: Karachi, Sindh, Pakistan
- Footer watermark: *Designed & Developed with ♥ by [Muhammad Ahmed](https://mahmedpro.com)*

## ✅ Before going live
1. Replace `https://ahmedranks.com` with the final domain in canonicals, schema, sitemap.xml.
2. Add real social profile URLs (currently placeholder homepages).
3. Optionally swap Unsplash imagery for real project screenshots (keep alt text keyword-rich).
4. Submit sitemap to Google Search Console; validate schema at search.google.com/test/rich-results.
