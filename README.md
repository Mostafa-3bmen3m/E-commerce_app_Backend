# ⚙️ LUMINA | Backend Service

Welcome to the backend engine of LUMINA. This Node.js/Express service connects our frontend to our database and handles everything from serving up the product catalog (complete with sorting, filtering, and pagination) to managing our secure authentication logic using JWTs.

---

## 🛠️ The Tech Stack

- **Server**: Node.js and Express built with TypeScript for robust routing and middleware typing.
- **Database**: PostgreSQL hooked up via Prisma ORM for fully type-safe database queries.
- **Authentication**: Custom `json-web-token` (JWT) setup utilizing both short-lived access tokens and longer-lived refresh tokens.
- **Security**: Hardened with Helmet, an Express setup focused heavily on cross-origin resource sharing (CORS), and strict Rate Limiters to prevent brute force or denial-of-service attempts.

---

## 🏃‍♂️ Getting Started Locally

Here's exactly how to get your own developer environment running:

### 1. Install Dependencies
Navigate into the `/backend` directory and run:
```bash
npm install
```

### 2. Configure Your Environment Variables
You'll need a `.env` file in the root of the `/backend` directory.

```env
# Server Config
PORT=5000
NODE_ENV=development

# Neon / PostgreSQL Database URL
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# JWT Security
# Ensure these are long, random, and secure strings in production
JWT_SECRET="your_local_dev_secret"
JWT_REFRESH_SECRET="your_longer_refresh_secret"
```

### 3. Setup Prisma
We use Prisma to talk to our database. Before you start the server, you need to push our schema structure to your database. Run:
```bash
npx prisma db push
```
This command translates our `schema.prisma` file into actual SQL tables. After it completes, run:
```bash
npx prisma generate
```
This regenerates the Prisma Client so your TypeScript code knows exactly what your database looks like.

### 4. Start the Server
With dependencies and your database ready, spin up the server with hot-reload enabled:
```bash
npm run dev
```

The server should now be running cleanly on `http://localhost:5000`.

---

## 🚦 Core Features

If you're looking around the codebase, here are some key areas:

### 1. Cross-Device Watchlist
The `watchlistController.ts` handles our premium "Vault". Users can `POST` toggle products which adds or removes a many-to-many relationship using Prisma's `connect`/`disconnect` functionality.

### 2. Admin Capabilities
The `authMiddleware.ts` enforces user roles. Several routes, like changing an order status or updating product details, require a completely valid JWT that carries the `ADMIN` role claim. If not, the request immediately bounces with an authorization error.

### 3. Centralized Error Handling
In `security.ts`, any route that throws an error is funneled through the main error wrapper, returning a clean JSON response rather than exposing a raw stack trace to humanity.

---

## 🚀 Deployment

The LUMINA backend lives on **Railway** connected to a serverless **Neon** Postgres database. 

If deploying this yourself:
1. Ensure your Railway project uses Node as the build environment.
2. Under "Variables" in Railway, populate `DATABASE_URL`, `JWT_SECRET`, and `JWT_REFRESH_SECRET`.
3. If you encounter authentication issues after an automatic setup, it inherently stems from missing these variables!
