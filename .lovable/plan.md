# Images in public folder + Netlify-ready build

## What you asked
- Push everything to GitHub
- Keep all images in the `public` folder
- Deploy on Netlify with every image showing correctly

## About the GitHub push
Nothing extra is needed from me here. Since the project is connected to GitHub, every change I make is committed and pushed to your repository automatically. So once the changes below are made, they are already in GitHub and Netlify can build from that repository.

## What I will change

### 1. Move every image into the public folder
Today all 26 pictures (home banner, the 9 category banners, plant and pot photos, product detail photos, the comparison photo) sit in a private source folder and are bundled by the build tool. I will move them to `public/images/` so they are plain files served straight from the site root.

### 2. Point every place that uses a picture to the new location
There are 51 picture references across 5 files (home page, category banner, category rail, home banner slider, and the preview product data). Each one becomes a simple path like `/images/sample-peace-lily.jpg`, which works the same in the preview, in the published Lovable site, and on Netlify.

### 3. Make the project buildable on Netlify
This app has a server side (it is not a plain static site), so Netlify needs to be told how to run it. I will add a Netlify configuration file and set the build output to the Netlify format, so a normal "connect repo → deploy" on Netlify works with no manual settings.

### 4. Check it
I will run a production build and open the site to confirm the home page, a category page, and a product page all show their pictures.

## Technical details
- `src/assets/*.{jpg,png}` → `public/images/*`; delete the old folder.
- Replace ES imports (`import heroImage from "@/assets/..."`) with literal `/images/...` strings in:
  `src/routes/index.tsx`, `src/components/category/preview-products.ts`,
  `src/components/category/category-rail.tsx`, `src/components/category/category-hero.tsx`,
  `src/components/home/hero-carousel.tsx`.
- Add `netlify.toml` (`command = "npm run build"`, publish/functions per Nitro Netlify preset) and set the Nitro preset to `netlify` in `vite.config.ts` via the existing `defineConfig` options.
- Keep `.env` values out of the repo; on Netlify the `VITE_*` variables (API base URL, Razorpay key id, etc.) must be added in Netlify's environment settings — without `VITE_API_BASE_URL` the deployed site cannot reach the backend.
- Verify with `bun run build` plus a Playwright pass at 1280 and 375 px.

## Note
Moving images out of the bundle means they are no longer fingerprinted, so browser caching is slightly less aggressive. Everything else stays the same.
