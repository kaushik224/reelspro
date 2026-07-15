# ReelsPro

A full-stack video sharing platform with a modern React frontend and Next.js backend.

## Project Structure

```
reelspro/
├── frontend/          # React + TypeScript + Vite frontend application
├── backend/           # Next.js API backend with MongoDB
├── docs/              # Project documentation
└── README.md          # This file
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

Run the development server:

```bash
npm run dev
```

The frontend will run on [http://localhost:5173](http://localhost:5173)

## Documentation

- [Frontend Integration Plan](docs/FRONTEND_INTEGRATION_PLAN.md)
- [Implementation Report](docs/IMPLEMENTATION_REPORT.md)
- [ReelsPro Audit](docs/REELSPRO_AUDIT.md)

## Tech Stack

### Backend
- Next.js 15
- MongoDB with Mongoose
- NextAuth.js for authentication
- ImageKit for media handling

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- TailwindCSS

## Development

To run both frontend and backend simultaneously, use the provided script:

```bash
./run.sh
```

Or run each service in separate terminals as described above.
