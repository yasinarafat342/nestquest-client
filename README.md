# NestQuest — Property Rental & Booking Platform (Client)

Frontend React application for the NestQuest Property Rental & Booking Platform.

## Live URL
> Add your Vercel deployed URL here

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- React Router DOM v6
- TanStack React Query
- Framer Motion (animations)
- Stripe (payments)
- Firebase (Google Auth)
- Recharts (analytics charts)
- Axios
- React Hot Toast

## npm Packages
| Package | Purpose |
|---------|---------|
| `react-router-dom` | Client-side routing |
| `@tanstack/react-query` | Data fetching & caching |
| `axios` | HTTP client with JWT interceptor |
| `framer-motion` | Page animations |
| `@stripe/react-stripe-js` | Stripe payment UI |
| `firebase` | Google social login |
| `recharts` | Monthly earnings line chart |
| `react-hot-toast` | Toast notifications |
| `react-icons` | Icon library |
| `date-fns` | Date formatting |
| `tailwindcss` | Utility CSS framework |

## Key Features
- JWT-based auth with Google social login (Firebase)
- Role-based UI (Tenant / Owner / Admin)
- Homepage with hero, search bar, featured properties, reviews, top locations, stats — all animated with Framer Motion
- All Properties page with backend search, filter (type), sort (price), and pagination
- Property Details page with image gallery, favorites, booking modal
- Stripe payment flow with booking creation
- Tenant dashboard: My Bookings, Favorites, Profile
- Owner dashboard: Analytics (Recharts line chart), Add Property, My Properties (with rejection feedback eye icon), Booking Requests
- Admin panel: Users (change role), Properties (approve/reject with feedback modal), Bookings, Transactions
- Persistent login (localStorage token + /api/auth/me on load)
- Private routes + role-protected routes
- Fully responsive (mobile, tablet, desktop)

## Setup

```bash
npm install
cp .env.example .env
# Fill in Firebase, Stripe, and API URL keys
npm run dev
```

## Environment Variables
```
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_STRIPE_PUBLISHABLE_KEY=
```

## Deployment (Vercel)
1. Push to GitHub
2. Import repo in Vercel
3. Set all `VITE_*` environment variables in Vercel dashboard
4. Add your Vercel domain to Firebase authorized domains
5. Deploy!
