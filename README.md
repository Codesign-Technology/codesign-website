# codesign-website

The static website for **codesign.technology**. It is plain HTML and CSS with one small script and no build step. Cloudflare Pages hosts it for free.

## Structure

| Path | What it is |
|---|---|
| `index.html`, `about/index.html`, `contact/index.html` | The three pages |
| `404.html` | Not-found page (Cloudflare Pages serves it automatically) |
| `assets/css/site.css` | All styles. The brand colours are CSS variables at the top. |
| `assets/js/site.js` | Footer year and the contact form handler |
| `assets/fonts/` | Outfit variable font, self-hosted (SIL OFL, see `OFL.txt`) |
| `assets/img/` | Logos (copied from the brand kit) |
| `favicon.*`, `apple-touch-icon.png`, `icon-*.png`, `site.webmanifest` | Icons, rendered from the brand kit `Favicon.svg` |
| `og-image.png` | 1200×630 link-preview image |
| `_headers` | Security headers (CSP etc.) and cache rules for Cloudflare Pages |
| `_redirects` | Old Wix URLs, for example `/contact-8` to `/contact/` |

## Edit and preview locally

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

The navigation, header and footer are repeated in each page, so a change to them has to be made in all four HTML files.

## Contact form

The form posts to [Web3Forms](https://web3forms.com). The free plan allows 250 submissions a month.

1. Create an access key at web3forms.com using **hello@codesign.technology**. Submissions are delivered to that address.
2. Replace `REPLACE_WITH_WEB3FORMS_ACCESS_KEY` in `contact/index.html` with the key. The key is public by design, because it only says where to deliver.

Spam protection is a hidden honeypot field (`botcheck`) plus Web3Forms' own filtering. hCaptcha can be added later if spam becomes a problem; the CSP in `_headers` would then need the hCaptcha domains.

## Deploy (Cloudflare Pages)

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**, then pick this repo.
2. Framework preset **None**, build command **empty**, output directory **`/`**.
3. Every push to `main` then deploys automatically, and each branch gets a preview URL.
4. **Custom domains**: add `www.codesign.technology` (canonical) and `codesign.technology`. Then add a redirect rule from the apex to `www`.
