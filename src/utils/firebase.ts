import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const config = {
  apiKey: "AIzaSyBoa4u0uOc70UOZ4TSwMfqejeOUJNXOI-A",
  authDomain: "cuidando-nuestro-bolsillo-rg.firebaseapp.com",
  projectId: "cuidando-nuestro-bolsillo-rg",
  storageBucket: "cuidando-nuestro-bolsillo-rg.appspot.com",
  messagingSenderId: "319489361622",
  appId: "1:319489361622:web:08ddf0d605ed857299eb77",
  measurementId: "G-JG8HF9KC1Z",
};

export const app = initializeApp(config);
export const auth = getAuth(app);
