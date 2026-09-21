# Memory — Nursery Frontend

## Project Context
- **Project**: MyGurden — Premium Plant Nursery E-Commerce
- **Frontend URL**: https://mygurden.netlify.app
- **Backend URL**: https://nursery-backend-c8yw.onrender.com
- **Admin Panel URL**: https://adminnursery.netlify.app
- **GitHub Repo**: https://github.com/ulmind-com/Nursery-Frontend

## Deployment
- **Frontend**: Netlify (auto-deploy from `main` branch)
- **Admin**: Netlify (separate site, repo: `Nursery-Admin`)
- **Backend**: Render (repo: separate)
- Render free tier: backend sleeps after 15min inactivity, first request takes ~30-50s

## Firebase Setup
- **Project ID**: `mygurden`
- **Service Account**: `firebase-adminsdk-fbsvc@mygurden.iam.gserviceaccount.com`
- **Auth Methods**: Google Sign-In (Firebase popup), Email/Password with OTP
- **Backend verifies** Firebase ID tokens via `firebase-admin` SDK
- Domain `mygurden.netlify.app` added to Firebase Authorized Domains

## Environment Variables

### Netlify (Frontend)
- `VITE_API_BASE_URL` — Backend API URL
- `VITE_FIREBASE_API_KEY` — Firebase web API key
- `VITE_FIREBASE_AUTH_DOMAIN` — `mygurden.firebaseapp.com`
- `VITE_FIREBASE_PROJECT_ID` — `mygurden`
- `VITE_FIREBASE_APP_ID` — Firebase web app ID

### Netlify (Admin)
- `VITE_API_URL` — Backend API URL (⚠️ different variable name than frontend!)

### Render (Backend)
- `FIREBASE_CREDENTIALS` — Service account JSON (single line)
- `FIREBASE_PROJECT_ID` — `mygurden`
- Plus: MONGO_URI, JWT_SECRET, CLOUDINARY_*, RAZORPAY_*, etc.

## Important Notes
- Frontend uses `VITE_API_BASE_URL`, Admin uses `VITE_API_URL` — different variable names!
- Backend has no `/api/v1` prefix — routes are directly `/products`, `/auth/login`, etc.
- Login/Signup pages have both Email/Password and Google Sign-In options
- The project is connected to Lovable — do NOT force push or rebase published history
- `package-lock.json` is in the repo (npm based), `bun.lock` also exists (from Lovable)
