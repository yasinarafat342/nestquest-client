# NestQuest — Property Rental & Booking Platform (Client)

## Project Name
**NestQuest** — Property Rental & Booking Platform (Frontend)

## Purpose
NestQuest is a full-stack property rental marketplace that connects tenants and property owners through a transparent and secure rental marketplace. Property owners can list rental properties, while tenants can discover, book, and pay reservation fees online. The platform features role-based access control (Tenant, Owner, Admin), property management, booking workflows, secure Stripe payments, a review system, and administrative moderation.

## Live URL
🔗 https://nestquest-client.vercel.app

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

## npm Packages Used
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
| `jspdf` / `jspdf-autotable` | PDF earnings report generation |
| `tailwindcss` | Utility CSS framework |

## Key Features
- 🔐 JWT-based authentication with Google social login (Firebase) — social-login users default to Tenant role
- 👥 Role-based UI (Tenant / Owner / Admin)
- 🏡 Homepage with hero, search bar, featured properties, customer reviews, top locations, and rental statistics — all animated with Framer Motion
- 🔍 All Properties page with backend-driven search, filter (property type), sort (price), and pagination
- 🏠 Property Details page with image gallery, favorites, and booking modal
- 💳 Stripe payment flow with automatic booking creation on success
- 📋 Tenant Dashboard — My Bookings, Favorites, Profile
- 📊 Owner Dashboard — Analytics with Recharts line chart, Add Property, My Properties (with rejection feedback 👁 icon), Booking Requests
- 🛠️ Admin Dashboard — Users (change role), Properties (approve/reject with feedback modal), Bookings, Transactions
- 🔄 Persistent login session (no logout/redirect on page reload of private routes)
- 🛡️ Private routes and role-protected routes
- 📱 Fully responsive design (mobile, tablet, desktop)
- 📄 Downloadable monthly earnings PDF report for property owners

## Setup

```bash
npm install
cp .env.example .env
# Fill in Firebase, Stripe, and API URL keys
npm run dev
```

## Environment Variables