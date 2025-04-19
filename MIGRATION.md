# Migration to Next.js

This document summarizes the migration of the Blockchain Days'25 Networking Event application from vanilla JavaScript to Next.js.

## Migration Overview

The original application was built with vanilla JavaScript, HTML, and CSS. It has been migrated to a modern Next.js application with TypeScript, React, and Tailwind CSS.

## Key Components

1. **Authentication/User Registration**
   - Migrated the authentication flow to React components
   - Added form validation with TypeScript type checking
   - Implemented responsive modal design with Tailwind CSS

2. **Profile Management**
   - Created a React-based profile component
   - Added state management for editing and viewing profile information
   - Maintained the same functionality for managing user data

3. **Friend Finder**
   - Implemented API routes for user search
   - Created a React component with search functionality
   - Added UI improvements with Tailwind CSS

4. **QR Code Scanning**
   - Integrated the jsQR library for QR code scanning
   - Created a testing QR generator page
   - Maintained the same point system for scanning

5. **Leaderboard**
   - Implemented API routes for the leaderboard
   - Created a responsive leaderboard component
   - Added visual elements to highlight top performers

6. **Storage and Data Management**
   - Migrated the storage utilities to TypeScript
   - Created strongly typed interfaces for data models
   - Maintained the same local storage functionality

7. **Progressive Web App (PWA) Support**
   - Created a manifest.json file
   - Implemented a service worker
   - Added offline support
   - Set up proper icons and theming

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Framework**: Next.js 14
- **API**: Next.js API Routes
- **Storage**: LocalStorage (client-side)
- **QR Scanning**: jsQR
- **PWA Support**: Service Worker, Web Manifest

## Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Testing

- Use the `/qr-generator` route to create test QR codes
- Test the application on both desktop and mobile devices
- Verify PWA installation functionality

## Future Improvements

1. Add server-side storage with a database
2. Implement user authentication with NextAuth.js
3. Add real-time updates with WebSockets
4. Improve offline capabilities
5. Add comprehensive testing 