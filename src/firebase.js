import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Para la base de datos
import { getAuth } from "firebase/auth"; // Para el login

const firebaseConfig = {
  apiKey: "AIzaSyAEkeEvi43cuUNvFAXBconeiYC-8RZms4I",
  authDomain: "crm-mainjobs.firebaseapp.com",
  projectId: "crm-mainjobs",
  storageBucket: "crm-mainjobs.firebasestorage.app",
  messagingSenderId: "873216383021",
  appId: "1:873216383021:web:057b322656f2204ce4c0a4",
};

// Inicializamos la App
const app = initializeApp(firebaseConfig);

// Exportamos las herramientas para usarlas en el CRM
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
