import { initializeApp } from "firebase/app"

import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBdBoUHFDp7HpJ1Twb7l9RmDESr3dS7Fio",
  authDomain:
    "ai-resume-analyzer-b4a71.firebaseapp.com",

  projectId: "ai-resume-analyzer-b4a71",

  storageBucket:
    "ai-resume-analyzer-b4a71.firebasestorage.app",

  messagingSenderId: "1052379247373",

  appId:
    "1:1052379247373:web:ff96630bc9fb9109067644",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)