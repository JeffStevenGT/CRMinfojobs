import { db } from "./firebase.js";
import { collection, addDoc } from "firebase/firestore";

const seedDatabase = async () => {
  console.log("Iniciando carga de datos a Firebase...");

  const nuevoLead = {
    nombre: "Juan Pérez (Lead de Prueba)",
    whatsapp: "+51 999 888 777",
    provincia: "Toledo",
    situacion: "Dependiente",
    esReferido: "no",
    estado: "Inscrito",
    horario: "mañana",
    fechaLlamada: "",
    doc1: true,
    doc2: true,
    asistencia: Array(20).fill(true), // Los 20 días de clase
    faltas: "0",
    finalizo: "en curso",
    regalo: "no",
  };

  try {
    const docRef = await addDoc(collection(db, "leads"), nuevoLead);
    console.log("✅ ¡Éxito! Base de datos creada con ID:", docRef.id);
    alert("¡Base de datos vinculada con éxito! Ya puedes borrar este botón.");
  } catch (e) {
    console.error("❌ Error al mandar datos:", e);
    alert("Error: " + e.message);
  }
};

export default seedDatabase;
