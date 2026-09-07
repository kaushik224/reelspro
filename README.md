# ReelsPro

A full-stack video sharing platform with a NestJS backend and React frontend.

## Project Structure

```
reelspro-nestjs/
├── backend/           # NestJS backend API
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── users/             # Users module
│   │   ├── videos/            # Videos module
│   │   ├── imagekit/          # ImageKit integration
│   │   ├── database/          # MongoDB configuration
│   │   ├── cache/             # Redis cache module
│   │   ├── likes/             # Likes module
│   │   ├── comments/          # Comments module
│   │   ├── follows/           # Follows module
│   │   ├── common/            # Common utilities (interceptors, filters)
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/          # React/Vite frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # React context providers
│   │   ├── lib/               # Utility functions
│   │   ├── pages/             # Page components
│   │   ├── routes/            # Route configurations
│   │   ├── services/          # API services
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Architecture

### Modules

- **AuthModule**: Handles user authentication (register, login, session, logout) with JWT-based HTTP-only cookies
- **UsersModule**: Manages user data and password hashing with bcrypt
- **VideosModule**: Manages video CRUD operations with MongoDB
- **ImagekitModule**: Provides ImageKit upload authentication parameters
- **DatabaseModule**: Centralized MongoDB/Mongoose connection configuration
- **RedisCacheModule**: Redis caching for improved performance
- **LikesModule**: Manages video like/unlike functionality
- **CommentsModule**: Manages video comments with nested replies
- **FollowsModule**: Manages user follow/unfollow functionality

### Authentication Flow

1. **Register**: POST /api/auth/register
   - User provides email and password
   - Password is hashed with bcrypt before storage
   - User is saved to MongoDB

2. **Login**: POST /api/auth/login
   - User provides email and password
   - Credentials are validated against MongoDB
   - JWT token is generated and set as HTTP-only cookie
   - Token expires in 30 days

3. **Session**: GET /api/auth/session
   - JWT cookie is validated
   - Current user information is returned

4. **Logout**: POST /api/auth/logout
   - JWT cookie is cleared
   - Session is invalidated

### Guards

- **JwtAuthGuard**: Applied to routes requiring authentication using @UseGuards(JwtAuthGuard)
- **@Public() decorator**: Decorator for marking public routes (currently not used with global guard)
- **ThrottlerGuard**: Global guard for rate limiting (configured in app.module.ts)

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user (public)
- `POST /api/auth/login` - Login and set auth cookie (public)
- `GET /api/auth/session` - Get current session (authenticated)
- `POST /api/auth/logout` - Logout and clear cookie (authenticated)

### Videos

- `GET /api/videos` - Get all videos with pagination (public)
- `GET /api/videos/search` - Search videos with filters (public)
- `GET /api/videos/:id` - Get video by ID (public)
- `POST /api/videos` - Create video (authenticated)
- `PATCH /api/videos/:id` - Update video (authenticated)
- `DELETE /api/videos/:id` - Delete video (authenticated)

### Likes

- `POST /api/videos/:id/likes` - Like a video (authenticated)
- `DELETE /api/videos/:id/likes` - Unlike a video (authenticated)
- `GET /api/videos/:id/likes` - Get video likes (public)
- `GET /api/videos/:id/likes/check` - Check if user liked video (authenticated)

### Comments

- `POST /api/videos/:id/comments` - Create comment on video (authenticated)
- `GET /api/videos/:id/comments` - Get video comments with pagination (public)
- `DELETE /api/comments/:id` - Delete comment (authenticated)

### Follows

- `POST /api/users/:id/follow` - Follow a user (authenticated)
- `DELETE /api/users/:id/follow` - Unfollow a user (authenticated)
- `GET /api/users/:id/followers` - Get user's followers (public)
- `GET /api/users/:id/following` - Get user's following (public)
- `GET /api/users/:id/follow-status` - Check if following user (authenticated)

### ImageKit

- `GET /api/auth/imagekit-auth` - Get upload auth parameters (authenticated)


## Environment Variables

### Backend

Create a `.env` file in the backend directory:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/reelspro
JWT_SECRET=your-jwt-secret-key-change-in-production
JWT_EXPIRATION=30d
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
CORS_ORIGIN=http://localhost:5173
REDIS_HOST=localhost
REDIS_PORT=6379
CACHE_TTL=300
```

### Frontend

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3001
```

## Installation

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Running the Application

### Backend

Development:
```bash
cd backend
npm run start:dev
```

Production:
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend

Development:
```bash
cd frontend
npm run dev
```

Production:
```bash
cd frontend
npm run build
npm run preview
```

The backend runs on port 3001 by default, and the frontend runs on port 5173.

## Database

- **MongoDB** with Mongoose ODM
- User schema: email, password (hashed), timestamps
- Video schema: title, description, videoUrl, thumbnailUrl, controls, transformation, timestamps
- Backward compatibility for legacy documents with `vidoeUrl` typo

## Security

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens stored in HTTP-only cookies
- ImageKit private key never exposed to client
- All sensitive data in server-side environment variables
- CORS configured for specific origins with credentials
- DTO validation with class-validator

