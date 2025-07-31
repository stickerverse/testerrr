# Stickerverse Sticker Editor

A web application for creating and ordering custom stickers with real-time preview, material selection, and design customization.

## Features

- Interactive sticker editor
- Real-time preview
- Material selection with pricing
- Text, shapes, and clipart tools
- Image upload and gallery
- User authentication
- Design saving
- Shopping cart functionality

## Firebase Integration

The application uses Firebase for:
- User authentication (email/password and Google)
- Firestore database to store user designs and cart items
- Storage for saving design images

## Run Locally

**Prerequisites:**
- Node.js
- Firebase account

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file at the root of the project with your Firebase credentials (see `.env.example` for required variables):
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

3. Run the development server:
   ```
   npm run dev
   ```

## Firebase Setup

1. Create a new Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication with Email/Password and Google providers
3. Create a Firestore database
4. Set up Storage
5. Add a web app to your Firebase project and copy the configuration values to your `.env` file

## Project Structure

- `/components` - React components for the UI
- `/firebase` - Firebase configuration and service functions
- `/components/auth` - Authentication components
- `/components/panels` - Editor panel components
