# VideoApp

VideoApp is a full-stack video sharing application with user accounts, video feeds, playlists, comments, likes, subscriptions, watch history, and account security controls. The frontend is built with React and Vite, while the backend uses Node.js, Express, MongoDB, JWT authentication, Cloudinary media storage, and Socket.IO.

## Features

- User registration, login, logout, email verification, and password reset
- JWT access tokens with refresh token rotation
- Session management with trusted devices and revoked-session handling
- Optional two-factor authentication support
- Password history checks and account security flows
- Video upload, update, delete, and listing
- Cloudinary-backed video and image storage
- Search suggestions and search-targeted feed results
- Cursor-based video feed pagination
- Watch page, shorts page, and user video library
- Playlist creation, update, delete, and video management
- Reusable horizontal video list UI for playlist videos and selection flows
- Multi-select add-to-playlist workflow from user videos
- Comments, likes, subscriptions, and watch history
- User profile, avatar, cover image, and appearance settings
- CORS and cookie settings configured for development and production

## Tech Stack

### Frontend

- React
- Vite
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- Socket.IO Client

### Backend

- Node.js
- Express
- MongoDB and Mongoose
- JWT
- bcrypt
- Cloudinary
- Multer
- Nodemailer
- Socket.IO
- CORS and cookie-parser

## Project Structure

```text
videoAPP/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── apis/
│   │   ├── components/
│   │   ├── config/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── store/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
└── README.md
```

## Environment Variables

Never commit real `.env` files. Use the example files as templates:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

### Backend

Required production values usually include:

```env
NODE_ENV=production
PORT=8081
BASE_URL=https://your-api-domain.com
FRONTEND_URL=https://your-frontend-domain.com
FRONTEND_URLS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
MONGODB_URI=mongodb+srv://user:password@cluster/dbname
ACCESS_TOKEN_SECRET=replace-with-a-long-random-secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=replace-with-a-different-long-random-secret
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
GOOGLE_APP_EMAIL=your-email@example.com
GOOGLE_APP_PASSWORD=your-google-app-password
```

The backend supports `MONGODB_URI`. For local development, it can also use a MongoDB URL plus database name if configured in the example file.

### Frontend

Required production values usually include:

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_CLOUD_NAME=your-cloud-name
VITE_UPLOAD_PRESET=your-upload-preset
```

`VITE_API_BASE_URL` should point to the backend origin, not to a duplicated `/api/v1` path. The frontend config normalizes the API v1 base URL.

## Installation

Install dependencies in both apps:

```powershell
cd backend
npm install

cd ../frontend
npm install
```

## Development

Start the backend:

```powershell
cd backend
npm run dev
```

Start the frontend in another terminal:

```powershell
cd frontend
npm run dev
```

By default, the frontend should run through Vite and the backend should expose API routes under:

```text
http://localhost:8081/api/v1
```

## Production Build

Build the frontend:

```powershell
cd frontend
npm run build
```

Start the backend with production environment variables set:

```powershell
cd backend
npm start
```

Before deploying, make sure `NODE_ENV=production`, `FRONTEND_URL`, `MONGODB_URI`, JWT secrets, Cloudinary credentials, and email credentials are set in the hosting provider's secret manager or environment settings.

## API Overview

The backend groups routes under `/api/v1`. Route names may include:

```text
/api/v1/users
/api/v1/videos
/api/v1/playlists
/api/v1/comments
/api/v1/likes
/api/v1/subscriptions
```

Common flows include:

- Login and refresh sessions through the user routes
- Fetch videos and suggestions through the video routes
- Create playlists and add or remove videos through the playlist routes
- Update user profile, avatar, cover image, and appearance settings through account routes

## Security

This project includes several security-focused patterns:

- Access tokens and refresh tokens are separated
- Refresh tokens are rotated and tied to sessions
- Revoked sessions are handled by the auth flow
- Cookies are configured differently for production and development
- Production cookies should use secure settings and appropriate `sameSite` behavior
- CORS origins are controlled by frontend URL environment variables
- Passwords are hashed before storage
- Password reset and email verification flows avoid exposing raw credentials
- Cloudinary, JWT, MongoDB, and SMTP secrets are read from environment variables
- Frontend production builds require a valid API base URL instead of silently falling back to localhost

Recommended production hardening:

- Use long, random, unique values for `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`
- Store secrets only in the deployment platform's secret manager
- Do not expose backend secrets with a `VITE_` prefix
- Use HTTPS for both frontend and backend
- Restrict `FRONTEND_URLS` to real production domains only
- Use a dedicated MongoDB database user with the minimum required permissions
- Restrict Cloudinary upload presets and avoid unsigned uploads unless they are intentionally scoped
- Enable rate limiting for login, password reset, refresh token, and upload routes
- Add request size limits for JSON and file uploads
- Keep dependencies updated and run audits regularly
- Review server logs for repeated 401, session revoked, and failed login patterns
- Rotate secrets immediately if a `.env` file is exposed

## Useful Commands

Run backend syntax checks on important files:

```powershell
cd backend
node --check src/config/env.js src/app.js src/index.js src/db/mongoose.js
```

Run frontend lint checks on selected files:

```powershell
cd frontend
npx eslint src/apis/axios.js src/config/env.js src/components/common/Navbar.jsx
```

Build the frontend:

```powershell
cd frontend
npm run build
```

## Deployment Notes

- Configure backend CORS with the exact frontend domain.
- Configure frontend `VITE_API_BASE_URL` with the backend origin.
- Do not use localhost values in production.
- Make sure cookies work across the chosen frontend and backend domains.
- If frontend and backend are on different domains, verify `sameSite=None` and secure HTTPS cookie behavior.
- Confirm MongoDB network access allows the backend host.
- Confirm Cloudinary upload and delivery settings before accepting production uploads.

## Notes

This README describes the current project structure and the main security expectations for running the app safely. Keep `.env.example` files updated whenever new environment variables are added.
