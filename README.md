🚀 Stage 3: Pixel-Perfect Todo App

This project is a React Native (Expo) app built to match the provided Figma design. It's fully functional, with a real-time backend powered by Convex and a smooth light/dark theme switcher built with styled-components.

✨ Features
Real-time CRUD: Create, read, update (toggle complete), and delete tasks instantly.

Full Edit Mode: Tap any task to open a modal and edit its title, description, or due date.

Theme Switching: Persistent light/dark mode that respects your system settings or your manual choice.

Search & Filter: Instantly search your tasks or filter by "All," "Active," and "Completed."

Drag & Drop: Easily reorder your tasks.

Responsive: A single codebase that provides a pixel-perfect layout for both mobile and desktop.

🚀 How to Run The Project

1. Set Up Your Local Code
First, clone the repo, enter the directory, and install all the packages.

Bash

```
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
```
2. Set Up Your Convex Backend
This project needs a live backend to work. We'll use Convex for that.

In your terminal, run npx convex dev.

This will ask you to log in to Convex and create a new project. Follow the on-screen prompts.

Once it's running, it will give you a Convex URL. Copy this URL.

3. Create Your Environment File
The app needs to know where to find your new backend.

In the root of the project, create a new file named .env.local

Paste your Convex URL into this file like this:

EXPO_PUBLIC_CONVEX_URL="https://your-new-project-url.convex.cloud"
4. Run the App!
You'll need two terminals open:

Terminal 1 (Backend): Keep Convex running.

Bash

npx convex dev
Terminal 2 (App): Start the Expo server.

Bash

npx expo start
You can now open the app on your phone with Expo Go (a for Android or i for iOS) or in your browser (w for web).

📱 Building the .apk for Submission
This project uses EAS (Expo Application Services) to build the final .apk file.

Deploy your backend: First, you need a production backend. Run:

Bash

npx convex deploy
(This will give you your final, live URL. Copy it!)

Set up EAS:

Bash

npm install -g eas-cli
npx eas login
Add your Convex URL as a secret: This is the most important step. It tells the build server what your production URL is.

Bash

npx eas secret:create
It will ask for a Name: EXPO_PUBLIC_CONVEX_URL

It will ask for a Value: Paste your production URL from step 1.

Run the build:

Bash

npx eas build --platform android --profile preview
Once it's done, you can download the .apk file from the link it provides!

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.
