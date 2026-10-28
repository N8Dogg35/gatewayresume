# AI Resume Builder

Static site. There is no build step and no server. Answers stay in the browser.

## Run locally

From this folder:

```bash
python3 -m http.server 8765
```

Open http://127.0.0.1:8765/

## Deploy

This folder is the site. Push **this folder** as the repository root of [github.com/N8Dogg35/gatewayresume](https://github.com/N8Dogg35/gatewayresume.git). Do not push the parent `Resume` directory. That directory holds personal resumes and should stay off GitHub.

```bash
cd wizard
git init
git add .
git commit -m "Publish the resume builder"
git branch -M main
git remote add origin https://github.com/N8Dogg35/gatewayresume.git
git push -u origin main
```

In Netlify, import that GitHub repository.

- Build command: none
- Publish directory: the repository root (already set in `netlify.toml`)
- Site name: `gatewayresume`, so the address is `https://gatewayresume.netlify.app`

Share tags in `index.html` use that address for `share.png`. If the Netlify site name is different, update `og:url`, `og:image`, and `twitter:image` to the real `https://` address. Crawlers need the full URL.
