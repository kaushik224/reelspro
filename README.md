# ReelsPro

A video sharing platform with separated frontend and backend applications.

## Architecture

ReelsPro uses two independently deployable applications:

### Frontend
- React 19 + TypeScript + Vite
- React Router for client-side routing
- TanStack Query for data fetching
- TailwindCSS for styling
- Axios for API communication

### Backend
- Next.js 15 (API-only mode)
- MongoDB with Mongoose
- NextAuth.js v4 for authentication
- ImageKit for media handling

The frontend communicates with the backend through HTTP APIs. The backend owns authentication, authorization, business logic, database access, and server-side integrations. The frontend owns presentation, routing, video playback, upload experience, and client-side state.

## Project Structure

```
reelspro/
├── frontend/          # React + TypeScript + Vite frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
│
├── backend/           # Next.js API backend
│   ├── app/
│   │   └── api/
│   │       ├── auth/
│   │       └── video/
│   ├── lib/
│   ├── models/
│   ├── middleware.ts
│   ├── package.json
│   └── .env (not committed)
│
├── docs/              # Project documentation
└── README.md
```

## Getting Started

### Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Set up environment variables (create `.env` file):

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

Run the development server:

```bash
npm run dev
```

The backend will run on [http://localhost:3000](http://localhost:3000)

### Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Copy the example environment file:

```bash
cp .env.example .env
```

The default `.env.example` is configured for development with Vite's proxy. For production, update `VITE_API_URL` to your actual backend API URL.

Run the development server:

```bash
npm run dev
```

The frontend will run on [http://localhost:5173](http://localhost:5173)

## Authentication Flow

The application uses NextAuth.js with JWT session strategy and HTTP-only cookies:

1. **Frontend Login**: User submits email/password via `/api/auth/callback/credentials`
2. **Backend Authentication**: NextAuth validates credentials against MongoDB
3. **Session Creation**: Backend creates HTTP-only session cookie
4. **Cookie Storage**: Browser stores the cookie automatically
5. **API Requests**: Frontend sends requests with `withCredentials: true` to include cookies
6. **Session Validation**: Backend validates session via NextAuth middleware
7. **Protected Routes**: Backend checks session before allowing access

### Key Implementation Details

- Frontend uses Vite proxy in development (`/api` → `http://localhost:3000`)
- Axios configured with `withCredentials: true` for cookie inclusion
- NextAuth session strategy: JWT with 30-day maxAge
- Middleware protects routes based on authentication status
- Cross-origin cookies require proper CORS configuration in production

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/callback/credentials` - Login
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Logout
- `GET /api/auth/csrf` - CSRF token
- `GET /api/auth/imagekit-auth` - ImageKit upload authentication

### Videos
- `GET /api/video` - Get all videos (public)
- `POST /api/video` - Create video (authenticated)

## ImageKit Integration

The ImageKit upload flow:

1. Frontend requests auth parameters from `/api/auth/imagekit-auth`
2. Backend generates signature using private key (server-side only)
3. Frontend uploads video directly to ImageKit
4. Frontend POSTs video metadata to `/api/video`
5. Backend stores video URL in MongoDB

**Important**: ImageKit private key never leaves the backend.

## Documentation

- [Frontend Integration Plan](docs/FRONTEND_INTEGRATION_PLAN.md)
- [Implementation Report](docs/IMPLEMENTATION_REPORT.md)
- [ReelsPro Audit](docs/REELSPRO_AUDIT.md)

## Development

To run both frontend and backend simultaneously, use the provided script:

```bash
./run.sh
```

Or run each service in separate terminals as described above.

## Build

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
npm run build
```
