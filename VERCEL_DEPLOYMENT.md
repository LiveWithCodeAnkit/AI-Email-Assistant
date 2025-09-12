# Deploy to Vercel (Frontend + Backend Together)

This guide shows how to deploy both your React frontend and Node.js tracking backend on Vercel in a single deployment.

## 📁 Project Structure
```
your-project/
├── src/                    # React frontend
├── api/                    # Backend API (Vercel Functions)
│   ├── server.js          # Main API handler
│   └── package.json       # API dependencies
├── vercel.json            # Vercel configuration
├── package.json           # Frontend dependencies
└── VERCEL_DEPLOYMENT.md   # This guide
```

## 🚀 Deployment Steps

### 1. **Prepare Your Project**
Make sure you have all the files created:
- ✅ `vercel.json` - Vercel configuration
- ✅ `api/server.js` - Backend API
- ✅ `api/package.json` - API dependencies
- ✅ Updated `src/services/TrackingService.js` - Auto-detects environment

### 2. **Set Environment Variable**
Your MongoDB connection string needs to be added as an environment variable:

**Via Vercel Dashboard:**
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add: `MONGODB_URI` = `mongodb+srv://ankit:9UHkKogwAIiNWcEs@upwork.fjlycf1.mongodb.net/?retryWrites=true&w=majority&appName=upworkfromvercel`

**Via Vercel CLI:**
```bash
vercel env add MONGODB_URI
# Paste your MongoDB connection string when prompted
```

### 3. **Deploy via GitHub (Recommended)**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add Vercel deployment config with MongoDB"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - **Important:** Add the MongoDB environment variable before deploying
   - Click "Deploy"

### 4. **Deploy via Vercel CLI** (Alternative)
```bash
# In your project root
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? (enter your project name)
# - Directory? ./
# - Override settings? N
```

## 🔧 Configuration Details

### `vercel.json` Explanation:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",  // Builds React app
      "config": { "distDir": "dist" }
    },
    {
      "src": "api/server.js",
      "use": "@vercel/node"           // Runs Node.js API
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/server.js"        // API routes
    },
    {
      "src": "/(.*)",
      "dest": "/$1"                   // Frontend routes
    }
  ]
}
```

## 🌐 How It Works

### **Frontend (React)**
- Builds with Vite
- Serves static files
- Automatically detects production environment

### **Backend (API)**
- Runs as Vercel Functions
- Handles `/api/*` routes
- Uses in-memory storage (resets on function restart)

### **API Endpoints:**
- `POST /api/visit` - Record visits
- `POST /api/store-key` - Store OpenAI keys
- `GET /api/data` - Get all data
- `GET /api/health` - Health check

## 📊 Data Storage - MongoDB

**Perfect!** Now using **MongoDB Atlas** for persistent storage:
- ✅ **Persistent Data** - Never loses data
- ✅ **Fast Access** - Optimized queries
- ✅ **Scalable** - Handles unlimited records
- ✅ **Analytics Ready** - Rich querying capabilities

### **Database Structure:**
- **Collection: `visits`** - User visits with IP, timestamp, user agent
- **Collection: `openai_keys`** - API key usage with action tracking

## 🔗 After Deployment

1. **Your app will be available at:** `https://your-project-name.vercel.app`
2. **API endpoints:** `https://your-project-name.vercel.app/api/health`
3. **Tracking works automatically** - no configuration needed!

### 📊 **View Your Data:**
- **Health Check:** `/api/health` - Server status and counts
- **All Data:** `/api/data` - Complete data with stats
- **Recent Visits:** `/api/visits?limit=20` - Last 20 visits
- **Recent Keys:** `/api/keys?limit=10` - Last 10 key usages
- **Statistics:** `/api/stats` - Detailed analytics

## 🛠️ Local Development

For local development, run both:
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend (if testing locally)
node server.js
```

## 🔄 Updates

To update your deployment:
```bash
git add .
git commit -m "Update app"
git push origin main
# Vercel auto-deploys on push!
```

## 🎯 Environment Variables (Optional)

If you need environment variables:
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add variables like `DATABASE_URL`, etc.

## ✅ Verification

After deployment, test:
1. Visit your app URL
2. Check browser console for tracking logs
3. Test API: `https://your-app.vercel.app/api/health`

That's it! Your React app and tracking backend are now deployed together on Vercel! 🎉