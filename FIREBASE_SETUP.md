# Firebase Setup Instructions

## 🔥 Firebase Configuration Setup

To complete the Firebase integration, you need to:

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "icon2025-contact-form")
4. Follow the setup wizard

### 2. Enable Authentication

1. In your Firebase project, go to **Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"** authentication
5. Click **"Save"**

### 3. Create Admin Users

1. In Authentication, go to **"Users"** tab
2. Click **"Add user"** and create accounts for:
   - `luckyalade309@gmail.com`
   - `paulinjeti@gmail.com`
3. Set passwords for these accounts

### 4. Enable Firestore Database

1. Go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (you can secure it later)
4. Select a location close to your users

### 5. Set up Firestore Security Rules

Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to submissions for authenticated admin users
    match /submissions/{document} {
      allow read, write: if request.auth != null && 
        request.auth.token.email in [
          'luckyalade309@gmail.com', 
          'paulinjeti@gmail.com'
        ];
      
      // Allow write access for anonymous users (contact form submissions)
      allow create: if true;
    }
  }
}
```

### 6. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"**
3. Click **"Web"** icon to add a web app
4. Register your app with a name
5. Copy the `firebaseConfig` object

### 7. Set up Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Replace the placeholder values in `.env` with your actual Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-actual-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
   VITE_FIREBASE_APP_ID=your-actual-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

3. **Important**: Never commit the `.env` file to version control. It's already included in `.gitignore`.

## 🚀 Testing the Setup

1. Start your development server: `npm run dev`
2. Try submitting a message through the contact form
3. Click "🔒 Admin Access" to login with admin credentials
4. Verify that submissions appear in the Admin Dashboard
5. Test the Excel export functionality

## 🔒 Security Notes

- Admin access is restricted to the two specified email addresses
- Firebase rules prevent unauthorized access to the database
- Authentication is required for all admin operations
- Regular users can only submit messages, not view or export data

## 📊 Database Structure

Submissions are stored in Firestore with this structure:

```
submissions/
  └── {document-id}/
      ├── name: string
      ├── message: string
      ├── timestamp: timestamp
      └── createdAt: string
```

## 🛠️ Troubleshooting

**Authentication Issues:**
- Ensure admin emails are exactly: `luckyalade309@gmail.com` and `paulinjeti@gmail.com`
- Check that Email/Password authentication is enabled
- Verify environment variables are set correctly in `.env` file

**Configuration Issues:**
- Make sure `.env` file exists and contains all required variables
- Verify that variable names start with `VITE_` prefix
- Check browser console for Firebase configuration errors
- Ensure `.env` file is in the project root directory

**Database Issues:**
- Ensure Firestore is enabled and rules are set correctly
- Check browser console for error messages
- Verify project ID matches in configuration

**Build Issues:**
- Make sure `firebase` package is installed: `npm install firebase`
- Check that all import paths are correct
- Verify Firebase configuration file exists and is properly formatted