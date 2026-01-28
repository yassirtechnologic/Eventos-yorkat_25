/* ==========================================================
   🔥 FIREBASE IMPORTS
========================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

/* ==========================================================
   🔧 FIREBASE CONFIG
========================================================== */
const firebaseConfig = {
  apiKey: "AIzaSyCTHFlgEOEBXThDzdTRvk_0BwLjaTwRc7E",
  authDomain: "striped-smile-475414-v0.firebaseapp.com",
  projectId: "striped-smile-475414-v0",
  storageBucket: "striped-smile-475414-v0.firebasestorage.app"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

/* ==========================================================
   🔐 PROTECCIÓN CORRECTA DEL PANEL (ANTI BUCLE)
========================================================== */
let authChecked = false;

onAuthStateChanged(auth, (user) => {
  if (authChecked) return;
  authChecked = true;

  if (!user) {
    console.warn("⛔ No autenticado → redirigiendo a login");
    window.location.replace("admin-login.html");
  } else {
    console.log("✅ Usuario autenticado:", user.email);
  }
});

/* ==========================================================
   🧠 DOM
========================================================== */
const btnGuardarPublicacion = document.getElementById("btnGuardarPublicacion");
const btnGuardarTestimonio = document.getElementById("btnGuardarTestimonio");
const btnSalir = document.getElementById("btnSalir");

const pubComentario = document.getElementById("pubComentario");
const pubImagen = document.getElementById("pubImagen");

const testNombre = document.getElementById("testNombre");
const testTexto = document.getElementById("testTexto");
const testEstrellas = document.getElementById("testEstrellas");

/* ==========================================================
   📝 PUBLICACIÓN (IMAGEN + FIRESTORE)
========================================================== */
async function guardarPublicacion() {
  const comentario = pubComentario.value.trim();
  const archivo = pubImagen.files[0];

  if (!comentario) {
    alert("Escribe un comentario.");
    return;
  }

  try {
    let imageUrl = "";

    if (archivo) {
      const imageRef = ref(
        storage,
        `publicaciones/${Date.now()}_${archivo.name}`
      );
      await uploadBytes(imageRef, archivo);
      imageUrl = await getDownloadURL(imageRef);
    }

    await addDoc(collection(db, "publicaciones"), {
      comentario,
      imageUrl,
      fecha: new Date().toISOString()
    });

    alert("✅ Publicación guardada");
    pubComentario.value = "";
    pubImagen.value = "";

  } catch (error) {
    console.error("❌ ERROR PUBLICACIÓN:", error);
    alert("Error al guardar publicación");
  }
}

/* ==========================================================
   💬 TESTIMONIO
========================================================== */
async function guardarTestimonioAdmin() {
  const nombre = testNombre.value.trim();
  const texto = testTexto.value.trim();
  const estrellas = testEstrellas.value;

  if (!nombre || !texto || !estrellas) {
    alert("Completa todos los campos");
    return;
  }

  try {
    await addDoc(collection(db, "testimonios"), {
      nombre,
      texto,
      estrellas: parseInt(estrellas),
      fecha: new Date().toISOString()
    });

    alert("✅ Testimonio guardado");
    testNombre.value = "";
    testTexto.value = "";
    testEstrellas.value = "";

  } catch (error) {
    console.error("❌ ERROR TESTIMONIO:", error);
    alert("Error al guardar testimonio");
  }
}

/* ==========================================================
   🔘 EVENTOS
========================================================== */
btnGuardarPublicacion?.addEventListener("click", guardarPublicacion);
btnGuardarTestimonio?.addEventListener("click", guardarTestimonioAdmin);

btnSalir?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.replace("index.html");
});







