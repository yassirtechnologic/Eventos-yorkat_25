/* ==========================================================
   🔐 PROTECCIÓN GLOBAL DEL PANEL
========================================================== */
if (
  window.location.pathname.includes("admin.html") &&
  localStorage.getItem("adminAuth") !== "true"
) {
  window.location.href = "admin-login.html";
}

/* ==========================================================
   🔥 FIREBASE IMPORTS
========================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/* ==========================================================
   🔥 FIREBASE CONFIG
========================================================== */
const firebaseConfig = {
  apiKey: "AIzaSyB_GFvlW4hrZ1fTAz8kB-6dybi83jVRmaQ",
  authDomain: "striped-smile-475414-v0.firebaseapp.com",
  projectId: "striped-smile-475414-v0",
  storageBucket: "striped-smile-475414-v0.appspot.com",
  messagingSenderId: "354814109895",
  appId: "1:354814109895:web:0fce975ddb6c180f1df6e2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ==========================================================
   📝 PUBLICACIONES
========================================================== */
export async function guardarPublicacion() {
  const comentario = document.getElementById("pubComentario").value;
  const archivo = document.getElementById("pubImagen")?.files[0];

  if (!comentario) return alert("Escribe un comentario.");

  let imagenBase64 = "";

  if (archivo) {
    const reader = new FileReader();
    reader.readAsDataURL(archivo);
    await new Promise((res) => (reader.onload = res));
    imagenBase64 = reader.result;
  }

  await addDoc(collection(db, "publicaciones"), {
    comentario,
    img: imagenBase64,
    fecha: new Date().toISOString()
  });

  alert("Publicación guardada");
  document.getElementById("pubComentario").value = "";
  if (archivo) document.getElementById("pubImagen").value = "";

  mostrarPublicaciones();
}

/* ==========================================================
   💬 TESTIMONIOS
========================================================== */
export async function guardarTestimonioAdmin() {
  const nombre = testNombre.value;
  const texto = testTexto.value;
  const estrellas = testEstrellas.value;

  if (!nombre || !texto || !estrellas)
    return alert("Completa todos los campos");

  await addDoc(collection(db, "testimonios"), {
    nombre,
    texto,
    estrellas: parseInt(estrellas),
    fecha: new Date().toISOString()
  });

  alert("Testimonio guardado");
  testNombre.value = "";
  testTexto.value = "";
  testEstrellas.value = "";

  mostrarTestimonios();
}

/* ==========================================================
   👁 MOSTRAR PUBLICACIONES
========================================================== */
export async function mostrarPublicaciones() {
  const cont = document.getElementById("adminListaPublicaciones");
  if (!cont) return;

  cont.innerHTML = "";
  const snap = await getDocs(collection(db, "publicaciones"));

  snap.forEach((d) => {
    const p = d.data();

    cont.innerHTML += `
      <div class="admin-card">
        ${p.img ? `<img src="${p.img}" class="admin-img">` : ""}
        <p>${p.comentario}</p>
        <small>${new Date(p.fecha).toLocaleString()}</small>
        <button class="btn-delete" onclick="eliminarPublicacion('${d.id}')">
          Eliminar
        </button>
      </div>
    `;
  });
}

/* ==========================================================
   👁 MOSTRAR TESTIMONIOS
========================================================== */
export async function mostrarTestimonios() {
  const cont = document.getElementById("adminListaTestimonios");
  if (!cont) return;

  cont.innerHTML = "";
  const snap = await getDocs(collection(db, "testimonios"));

  snap.forEach((d) => {
    const t = d.data();

    cont.innerHTML += `
      <div class="admin-card">
        <h4>${t.nombre}</h4>
        <p>${t.texto}</p>
        <p>⭐ ${t.estrellas}</p>
        <small>${new Date(t.fecha).toLocaleString()}</small>
        <button class="btn-delete" onclick="eliminarTestimonio('${d.id}')">
          Eliminar
        </button>
      </div>
    `;
  });
}

/* ==========================================================
   🗑 ELIMINAR
========================================================== */
window.eliminarPublicacion = async (id) => {
  if (!confirm("¿Eliminar publicación?")) return;
  await deleteDoc(doc(db, "publicaciones", id));
  mostrarPublicaciones();
};

window.eliminarTestimonio = async (id) => {
  if (!confirm("¿Eliminar testimonio?")) return;
  await deleteDoc(doc(db, "testimonios", id));
  mostrarTestimonios();
};

