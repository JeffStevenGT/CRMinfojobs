import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔥 NUEVA CONFIGURACIÓN para crm-mainjobs
const firebaseConfig = {
  apiKey: "AIzaSyAEkeEvi43cuUNvFAXBconeiYC-8RZms4I",
  authDomain: "crm-mainjobs.firebaseapp.com",
  projectId: "crm-mainjobs",
  storageBucket: "crm-mainjobs.firebasestorage.app",
  messagingSenderId: "873216383021",
  appId: "1:873216383021:web:057b322656f2204ce4c0a4",
};

// Inicializar Firebase
console.log("🚀 Iniciando Firebase con proyecto:", firebaseConfig.projectId);
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

console.log("✅ Firebase conectado correctamente");
console.log("📁 Proyecto:", firebaseConfig.projectId);
console.log("🔑 API Key:", firebaseConfig.apiKey.substring(0, 10) + "...");

export { db };
