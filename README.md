# 🍽️ FoodOrder — Frontend

> Next.js 14 · TypeScript · Tailwind CSS · Apollo Client

A role-aware food ordering frontend that connects to the NestJS GraphQL backend. UI elements are conditionally rendered based on the logged-in user's role and country.

---

## 📁 Project Structure

```
frontend/
│   ├── app/
│   │   ├── (auth)/                    # Public auth pages
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/               # Protected pages (JWT required)
│   │   │   ├── layout.tsx             # Auth guard + Navbar shell
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── restaurants/
│   │   │   │   ├── page.tsx           # Restaurant list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # Menu + Add to cart
│   │   │   ├── cart/
│   │   │   │   └── page.tsx           # Cart + Place order
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx           # My orders
│   │   │   │   └── all/
│   │   │   │       └── page.tsx       # All orders (Admin)
│   │   │   └── payment-methods/
│   │   │       └── page.tsx           # Manage payments (Admin)
│   │   ├── layout.tsx                 # Root layout + Providers
│   │   ├── page.tsx                   # Redirects to /login
│   │   └── globals.css
│   ├── components/
│   │   ├── ApolloWrapper.tsx          # Apollo provider wrapper
│   │   ├── LoadingSpinner.tsx
│   │   ├── Navbar.tsx                 # Top navigation
│   │   ├── RoleGuard.tsx              # Conditional render by role
│   │   └── StatusBadge.tsx            # Order status pill
│   ├── context/
│   │   ├── AuthContext.tsx            # User session + login/logout
│   │   └── CartContext.tsx            # Cart state management
│   ├── graphql/
│   │   ├── auth.ts                    # Login, Register mutations
│   │   ├── orders.ts                  # Order queries & mutations
│   │   ├── payments.ts                # Payment method operations
│   │   └── restaurants.ts             # Restaurant & menu queries
│   ├── lib/
│   │   └── apollo-client.ts           # Apollo Client setup with auth link
│   └── types/
│       └── index.ts                   # Shared TypeScript types
├── .env.local
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://npmjs.com/) v9+
- Backend server running at `http://localhost:3001` (see backend README)

---

## 🚀 Setup & Installation

### Step 1 — Install dependencies

```bash
npm install
```

### Step 2 — Configure environment variables

Create a `.env.local` file in the `frontend/` root:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3001/graphql
```

### Step 3 — Start the development server

```bash
npm run dev
```

The app will be available at: `http://localhost:3000`

---

## 🔑 Test Credentials

Use these accounts (created by the backend seed) to test all roles:

| Email | Password | Role | Country | Access Level |
|---|---|---|---|---|
| `admin.india@food.com` | `password123` | ADMIN | 🇮🇳 India | Full access |
| `manager.india@food.com` | `password123` | MANAGER | 🇮🇳 India | Order + Checkout |
| `member.india@food.com` | `password123` | MEMBER | 🇮🇳 India | View + Create order |
| `admin.america@food.com` | `password123` | ADMIN | 🇺🇸 America | Full access (US only) |

---

## 📸 Pages Overview

| Route | Access | Description |
|---|---|---|
| `/login` | Public | Sign in with email + password |
| `/register` | Public | Create a new account with role + country |
| `/dashboard` | All roles | Home with role-based quick access cards |
| `/restaurants` | All roles | Browse restaurants in your country |
| `/restaurants/[id]` | All roles | View menu, add items to cart |
| `/cart` | All roles | Review cart, place/checkout order |
| `/orders` | All roles | View own orders; Admin/Manager can checkout/cancel |
| `/orders/all` | Admin only | View all orders in the admin's country |
| `/payment-methods` | Admin only | Add, edit, delete payment methods |

---

## 🧩 Key Components

### `RoleGuard`
Conditionally renders children based on the user's role. Used throughout to hide buttons and sections:

```tsx
<RoleGuard allowedRoles={['ADMIN', 'MANAGER']}>
  <button>Checkout</button>
  <button>Cancel Order</button>
</RoleGuard>

<RoleGuard allowedRoles={['ADMIN']}>
  <PaymentMethodsManager />
</RoleGuard>
```

### `AuthContext`
Provides `user`, `login()`, and `logout()` globally. On mount, it re-validates the stored JWT by calling the `me` query.

### `CartContext`
Manages cart state across pages. Automatically clears when the user switches restaurants.

---

## 🌍 Country Scoping (Re-BAC)

The frontend enforces country restrictions in two ways:

1. **Backend-driven** — The `restaurants` query on the server automatically filters by `user.country`, so only country-appropriate restaurants are ever returned.
2. **UI-driven** — The Navbar displays the user's country, and the "All Orders" admin view is labelled with the scoped country flag.

---

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production build
npm run lint         # Run ESLint checks
npm run type-check   # Run TypeScript compiler check
```

---

## 📦 Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Apollo Client | GraphQL data fetching |
| lucide-react | Icon library |
| React Context API | Auth + Cart state |

---

## 🐛 Troubleshooting

**Apollo CORS error**
Make sure the backend has CORS enabled for `http://localhost:3000`:
```typescript
// backend/src/main.ts
app.enableCors({ origin: 'http://localhost:3000', credentials: true });
```

**JWT not attached to requests**
The `apollo-client.ts` reads from `localStorage`. Make sure you've logged in and the token is stored. Check DevTools → Application → Local Storage.

**"Forbidden" errors on role-protected pages**
Admin-only pages (`/payment-methods`, `/orders/all`) redirect non-admin users via `useEffect`. If you see a flash of content, this is expected during the redirect.

**`Cannot find module` errors**
Ensure your `tsconfig.json` has path aliases configured:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
