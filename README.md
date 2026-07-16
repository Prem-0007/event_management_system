# EventHive — Event Management System (MERN + Firebase)

## Features
- Firebase Authentication (Email/Password + Google)
- Create, edit, delete events (organizer-only edit/delete)
- Browse events with search, category filter, upcoming/past filter
- Register / cancel registration with live seat tracking
- Dashboard: total events, upcoming events, registered participants, your events, recent activity feed
- My Registrations page
- Dark/light theme toggle, glassmorphic UI, scroll animations, fully responsive

## Firebase setup (do first)
1. console.firebase.google.com → create project
2. Authentication → Sign-in method → enable Email/Password and Google
3. Project Settings → General → Add app → Web → copy the 6 config values
4. Project Settings → Service Accounts → Generate new private key → JSON file

## Backend setup
```
cd backend
npm install
cp .env.example .env
```
Fill in MONGO_URI and the 3 Firebase admin values from the service account JSON.
```
npm run dev
```

## Frontend setup
```
cd frontend
npm install
cp .env.example .env
```
Fill in VITE_API_URL and the 6 VITE_FIREBASE_* values from your Firebase web app config.
```
npm run dev
```

## Data flow
- Suppliers-style dependency doesn't apply here; Events are self-contained
- Only the event's organizer (creator) can edit or delete it
- Registration decrements seatsRemaining; cancelling increments it back
- A user can only hold one active registration per event (re-registering after cancel reactivates the same record)

## Deploy
Same pattern as before: Vercel (frontend) + Render (backend) + MongoDB Atlas (database).
Add Firebase env vars to both platforms. vercel.json is already included for SPA routing.
