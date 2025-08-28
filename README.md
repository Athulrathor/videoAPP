VideoApp
A full-stack video streaming platform built with the MERN stack, featuring user authentication, video management, and social features like likes, subscriptions, playlists, and watch history.

🚀 Features
User Authentication: Google OAuth integration with JWT token management

Video Management: Upload, stream, and manage videos

Social Features: Like/unlike videos, subscribe to channels

Playlist System: Create and manage custom playlists

Watch History: Track and view previously watched videos

Responsive Design: Mobile-friendly UI with Tailwind CSS

Cookie-based Sessions: Secure session management

🛠️ Tech Stack
Frontend:

React.js

Tailwind CSS

Axios for API calls

Backend:

Node.js

Express.js

MongoDB with Mongoose

JWT for authentication

Google OAuth 2.0

Cookie-parser for session management

📋 Prerequisites
Before running this application, make sure you have the following installed:

Node.js (v14 or higher)

MongoDB (local installation or MongoDB Atlas account)

Git

🔧 Installation & Setup
1. Clone the Repository
bash
git clone https://github.com/Athulrathor/videoAPP.git
cd videoAPP
2. Install Dependencies
Backend Dependencies:

bash
# Navigate to backend directory (if separate)
cd backend
npm install

# Or if package.json is in root
npm install
Frontend Dependencies:

bash
# Navigate to frontend directory (if separate)
cd frontend
npm install

# Or install all dependencies from root
npm install
3. Environment Variables
Create a .env file in the root directory and add the following variables:

text
# Database
MONGODB_URI=mongodb://localhost:27017/videoapp
# OR for MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/videoapp

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
4. Google OAuth Setup
Go to Google Cloud Console

Create a new project or select an existing one

Enable the Google+ API

Create credentials (OAuth 2.0 Client IDs)

Add authorized redirect URIs:

http://localhost:3000 (for frontend)

http://localhost:5000/auth/google/callback (for backend)

Copy Client ID and Client Secret to your .env file

5. Database Setup
For Local MongoDB:

bash
# Start MongoDB service
mongod
For MongoDB Atlas:

Create a cluster on MongoDB Atlas

Whitelist your IP address

Get the connection string and update MONGODB_URI in .env

🚀 Running the Application
Development Mode
Start Backend Server:

bash
npm run dev
Start Frontend (if separate):

bash
# In a new terminal, navigate to frontend directory
cd frontend
npm start
The application will be available at:

Frontend: http://localhost:3000

Backend API: http://localhost:5000

Production Notes
⚠️ Important: This application is currently configured for local development only. For production deployment, additional configuration is required including:

Environment-specific configurations

Production database setup

Domain-specific OAuth settings

SSL certificates

Production build optimizations

📁 Project Structure
text
videoApp/
│
├── backend/                 # Backend server files
│   ├── controllers/         # Request handlers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── server.js           # Main server file
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── public/
│
├── uploads/                # Video file storage (local)
├── .env                    # Environment variables
├── .gitignore
└── README.md
🔐 API Endpoints
Authentication
POST /auth/google - Google OAuth login

POST /auth/logout - User logout

GET /auth/me - Get current user

Videos
GET /api/videos - Get all videos

POST /api/videos - Upload new video

GET /api/videos/:id - Get video by ID

PUT /api/videos/:id - Update video

DELETE /api/videos/:id - Delete video

User Interactions
POST /api/videos/:id/like - Like/unlike video

POST /api/channels/:id/subscribe - Subscribe/unsubscribe

Playlists
GET /api/playlists - Get user playlists

POST /api/playlists - Create new playlist

PUT /api/playlists/:id - Update playlist

DELETE /api/playlists/:id - Delete playlist

History
GET /api/history - Get watch history

POST /api/history - Add to watch history

🎨 Features Walkthrough
User Authentication
Seamless Google OAuth integration

JWT token stored in HTTP-only cookies

Automatic token refresh mechanism

Video Management
Video upload with metadata

Thumbnail generation

Video streaming optimization

View count tracking

Social Features
One-click like/unlike functionality

Channel subscription system

Real-time subscriber count updates

Playlist System
Create custom playlists

Add/remove videos from playlists

Public/private playlist options

Watch History
Automatic history tracking

Chronological viewing history

Clear history functionality

🚧 Development Status
This project is currently in development phase with the following limitations:

Local Development Only: Not configured for production deployment

File Storage: Videos stored locally (not cloud storage)

No CDN: Direct video serving without content delivery network

Basic Security: Development-level security implementations

🔮 Future Enhancements
 Cloud storage integration (AWS S3, Cloudinary)

 Video transcoding for multiple qualities

 Real-time notifications

 Advanced search functionality

 Video comments system

 Live streaming capabilities

 Mobile app development

 Production deployment configuration

🐛 Troubleshooting
Common Issues
MongoDB Connection Error:

bash
# Ensure MongoDB is running
sudo systemctl start mongod
# Or for macOS with Homebrew
brew services start mongodb-community
Google OAuth Error:

Verify Google Client ID and Secret in .env

Check authorized redirect URIs in Google Console

Ensure correct domain/port configuration

Port Already in Use:

bash
# Find and kill process using port 5000
sudo lsof -t -i tcp:5000 | xargs kill -9
🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Developer
Athul Rathor

GitHub: @Athulrathor

Project: VideoApp Repository

🙏 Acknowledgments
React.js community for excellent documentation

MongoDB team for the robust database solution

Google for OAuth integration

Tailwind CSS for the utility-first CSS framework

Express.js for the minimalist web framework
