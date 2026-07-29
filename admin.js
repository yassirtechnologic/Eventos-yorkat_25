console.log("🔥 ADMIN JS CARGADO");
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
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
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
   🔐 PROTECCIÓN PANEL ADMIN
========================================================== */
let authChecked = false;

onAuthStateChanged(auth, (user) => {
  if (authChecked) return;
  authChecked = true;

  if (!user) {
    console.warn("⛔ No autenticado → login");
    window.location.replace("admin-login.html");
  } else {
    console.log("✅ Admin autenticado:", user.email);
  }
});

/* ==========================================================
   🧠 DOM
========================================================== */
const btnGuardarPublicacion = document.getElementById("btnGuardarPublicacion");
const btnGuardarTestimonio = document.getElementById("btnGuardarTestimonio");
const btnSalir = document.getElementById("btnSalir");

const pubComentario = document.getElementById("pubComentario");
const pubArchivo = document.getElementById("pubArchivo");
const tipoPublicacion = document.getElementById("tipoPublicacion");

const testNombre = document.getElementById("testNombre");
const testTexto = document.getElementById("testTexto");
const testEstrellas = document.getElementById("testEstrellas");

const adminGrid = document.getElementById("admin-publicaciones");

/* ==========================================================
   📝 GUARDAR PUBLICACIÓN
========================================================== */
async function guardarPublicacion() {
  const comentario = pubComentario.value.trim();

  const archivo = pubArchivo.files[0];

  const tipo = tipoPublicacion.value;

  if (!comentario) {
    alert("Escribe un comentario");
    return;
  }

  try {
    let imageUrl = "";

    if (archivo) {
      const carpeta = tipo === "video"
    ? "videos"
    : "publicaciones";

    const imageRef = ref(
        storage,
        `${carpeta}/${Date.now()}_${archivo.name}`
    );
      await uploadBytes(imageRef, archivo);
      imageUrl = await getDownloadURL(imageRef);
    }

    await addDoc(collection(db, "publicaciones"), {
      comentario,
      imageUrl,
      fecha: new Date().toISOString()
    });

    pubComentario.value = "";
    pubArchivo.value = "";

    cargarPublicacionesAdmin();
    alert("✅ Publicación guardada");

  } catch (err) {
    console.error("❌ Error publicación:", err);
    alert("Error al guardar publicación");
  }
}

/* ==========================================================
   💬 GUARDAR TESTIMONIO (ADMIN)
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
    await addDoc(collection(db, "publicaciones"), {

      comentario,

      imageUrl,

      tipo,

      fecha: new Date().toISOString()

  });

    testNombre.value = "";
    testTexto.value = "";
    testEstrellas.value = "";

    alert("✅ Testimonio guardado");

  } catch (err) {
    console.error("❌ Error testimonio:", err);
    alert("Error al guardar testimonio");
  }
}

/* ===========================
   🗑 CARGAR TESTIMONIOS ADMIN
=========================== */
async function cargarTestimoniosAdmin() {
  const contenedor = document.getElementById("testimoniosAdmin");
  contenedor.innerHTML = "";

  const snap = await getDocs(collection(db, "testimonios"));

  snap.forEach(d => {
    const t = d.data();

    const div = document.createElement("div");
    div.className = "testimonio-admin-card";
    div.innerHTML = `
      <p><strong>${t.nombre}</strong></p>
      <p>${t.texto}</p>
      <button class="btn-eliminar">Eliminar</button>
    `;

    div.querySelector("button").onclick = async () => {
      if (!confirm("¿Eliminar este testimonio?")) return;
      await deleteDoc(doc(db, "testimonios", d.id));
      cargarTestimoniosAdmin();
    };

    contenedor.appendChild(div);
  });
}

/* ==========================================================
   🗑️ LISTAR + ELIMINAR PUBLICACIONES (ADMIN)
========================================================== */
async function cargarPublicacionesAdmin() {
  if (!adminGrid) return;

  adminGrid.innerHTML = "";

  const q = query(
    collection(db, "publicaciones"),
    orderBy("fecha", "desc")
  );

  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (!data || !data.imageUrl) return;

    const card = document.createElement("div");
    card.className = "admin-card";

    card.innerHTML = `
      <img src="${data.imageUrl}">
      <p>${data.comentario || ""}</p>
      <button class="btn-delete">🗑 Eliminar</button>
    `;

    card.querySelector(".btn-delete").addEventListener("click", async () => {
      const ok = confirm("¿Eliminar esta publicación?");
      if (!ok) return;

      try {
        await deleteDoc(doc(db, "publicaciones", docSnap.id));
        cargarPublicacionesAdmin();
      } catch (err) {
        console.error("❌ Error eliminando:", err);
        alert("No se pudo eliminar");
      }
    });

    adminGrid.appendChild(card);
  });
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

/* ==========================================================
   🚀 INIT
========================================================== */
cargarPublicacionesAdmin();








