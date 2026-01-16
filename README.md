# Genesis Protocol v5

## 🛠 Beginner Setup Guide

1. **Install Node.js**: Download the LTS version from [nodejs.org](https://nodejs.org/).
2. **Download VS Code**: Use this to edit your files.
3. **Download Project**: Create a folder and put all the project files inside.
4. **Environment Setup**:
   - Create a file named `.env` in the root folder.
   - Add `API_KEY=your_gemini_key` to that file.
5. **Firebase Setup**:
   - Create a project at [console.firebase.google.com](https://console.firebase.google.com).
   - Enable **Authentication** (Email/Pass) and **Firestore**.
   - Copy your config into `firebaseConfig.ts`.

## 🚀 How to Run
In your terminal/command prompt:
```bash
# Install everything
npm install

# Start local test mode
npm run dev

# Deploy to the web
npm run build
firebase login
firebase deploy
```
