# codesign-website

The static website for **codesign.technology**. It is plain HTML and CSS with one small script and no build step. A Cloudflare Worker serves it as static assets (free plan).

## Structure

| Path | What it is |
|---|---|
| `wrangler.jsonc` | Worker config. Only `public/` is published, unknown URLs get `404.html`. |
| `public/index.html`, `about/index.html`, `contact/index.html` | The three pages |
| `public/404.html` | Not-found page (Cloudflare Pages serves it automatically) |
| `public/assets/css/site.css` | All styles. The brand colours are CSS variables at the top. |
| `public/assets/js/site.js` | Footer year and the contact form handler |
| `public/assets/fonts/` | Inter variable font for headings, self-hosted (SIL OFL, see `OFL-Inter.txt`). Body text uses the system Helvetica/Arial. |
| `public/assets/img/` | Logos (copied from the brand kit) |
| `public/favicon.*`, `apple-touch-icon.png`, `icon-*.png`, `site.webmanifest` | Icons, rendered from the brand kit `Favicon.svg` |
| `public/og-image.png` | 1200×630 link-preview image |
| `public/_headers` | Security headers (CSP etc.) and cache rules for Cloudflare Pages |
| `public/_redirects` | Old Wix URLs, for example `/contact-8` to `/contact/` |

## Edit and preview locally

```sh
npx wrangler dev        # then open http://localhost:8787 (applies _headers, _redirects and the 404 page)
# or, without Node: cd public && python3 -m http.server 8000
```

The navigation, header and footer are repeated in each page, so a change to them has to be made in all four HTML files.

## Contact form

The form posts to [Web3Forms](https://web3forms.com). The free plan allows 250 submissions a month.

1. Create an access key at web3forms.com using **hello@codesign.technology**. Submissions are delivered to that address.
2. Replace `REPLACE_WITH_WEB3FORMS_ACCESS_KEY` in `public/contact/index.html` with the key. The key is public by design, because it only says where to deliver.

Spam protection is a hidden honeypot field (`botcheck`) plus Web3Forms' own filtering. hCaptcha can be added later if spam becomes a problem; the CSP in `_headers` would then need the hCaptcha domains.

## Deploy (Cloudflare Workers)

The Worker `codesign-website` is connected to this repo with Workers Builds. Every push to `main` deploys automatically (`npx wrangler deploy` reads `wrangler.jsonc`). The preview URL is https://codesign-website.mike-a2e.workers.dev/.

Custom domains: Worker → Settings → Domains & Routes → add `www.codesign.technology` and `codesign.technology`. The domain must be a zone in this Cloudflare account. Then add a redirect rule from the apex to `www`.
