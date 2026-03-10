import React, { useState, useEffect } from "react";
import Login from "./components/auth/Login";
import CrmDashboard from "./components/CrmDashboard";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(""); // Estado para el nombre dinámico
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    // Este observador detecta cuando alguien entra o sale
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Buscamos al usuario en la colección "usuarios_permitidos" por su email
          const q = query(
            collection(db, "usuarios_permitidos"),
            where("email", "==", currentUser.email.toLowerCase().trim()),
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();

            setUser(currentUser);
            setUserRole(userData.rol);

            // PRIORIDAD DE NOMBRE:
            // 1. El campo "nombre" que agregaste en Firestore (el más seguro)
            // 2. El displayName de Firebase Auth
            // 3. Un pedazo del email si no hay nada más
            const nombreFinal =
              userData.nombre ||
              currentUser.displayName ||
              currentUser.email.split("@")[0];
            setUserName(nombreFinal);
          } else {
            // Si el correo no está en la lista blanca de Firestore, lo sacamos
            console.warn("Usuario no autorizado en Firestore");
            auth.signOut();
            setUser(null);
            setUserRole(null);
            setUserName("");
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
          setUser(null);
        }
      } else {
        // No hay nadie conectado
        setUser(null);
        setUserRole(null);
        setUserName("");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Función para manejar el éxito del login inmediatamente
  const handleLoginSuccess = (loggedUser, rol, nameFromLogin) => {
    setUser(loggedUser);
    setUserRole(rol);
    setUserName(nameFromLogin);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <CrmDashboard
      userRole={userRole}
      userEmail={user.email}
      userName={userName} // Pasamos el nombre correcto al Dashboard
    />
  );
}

export default App;
