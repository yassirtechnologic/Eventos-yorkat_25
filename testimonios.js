import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/* ===========================
   🔥 FIREBASE CONFIG
=========================== */
const firebaseConfig = {
  apiKey: "AIzaSyCTHFlgEOEBXThDzdTRvk_0BwLjaTwRc7E",
  authDomain: "striped-smile-475414-v0.firebaseapp.com",
  projectId: "striped-smile-475414-v0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ===========================
   ➕ ENVIAR TESTIMONIO
=========================== */
window.guardarTestimonio = async function () {
  try {
    const nombre = document.getElementById("nombre").value.trim();
    const texto = document.getElementById("texto").value.trim();
    const estrellas = parseInt(
      document.getElementById("estrellas").value,
      10
    );

    if (!nombre || !texto || Number.isNaN(estrellas)) {
      alert("Completa todos los campos correctamente");
      return;
    }

    await addDoc(collection(db, "testimonios"), {
      nombre,
      texto,
      estrellas,              // ⭐ número real
      fecha: new Date().toISOString(),
      aprobado: true           // 🔹 listo para futura moderación
    });

    alert("✅ Testimonio enviado correctamente");

    document.getElementById("nombre").value = "";
    document.getElementById("texto").value = "";
    document.getElementById("estrellas").value = "5";

  } catch (error) {
    console.error("🔥 Error real:", error);
    alert("No se pudo enviar el testimonio");
  }
};

/* ===========================
   👀 VER / CERRAR TESTIMONIOS
=========================== */
let testimoniosAbiertos = false;

window.toggleTestimonios = async function () {
  const grid = document.getElementById("testimonios-grid");
  const btn = document.getElementById("toggle-testimonios");

  // 🔒 CERRAR
  if (testimoniosAbiertos) {
    grid.style.display = "none";
    grid.innerHTML = "";
    btn.innerText = "Ver todos los comentarios";
    testimoniosAbiertos = false;
    return;
  }

  // 🔓 ABRIR
  btn.innerText = "Cerrar comentarios";
  grid.style.display = "grid";
  grid.innerHTML = "<p>Cargando testimonios...</p>";

  try {
    const q = query(
      collection(db, "testimonios"),
      orderBy("fecha", "desc")
    );

    const snap = await getDocs(q);
    grid.innerHTML = "";

    snap.forEach(doc => {
      const t = doc.data();

      const div = document.createElement("div");
      div.className = "testimonio-card";
      div.innerHTML = `
        <strong>${t.nombre || "Anónimo"}</strong>
        <p>${t.texto || ""}</p>
        <span>⭐ ${t.estrellas || 5}</span>
      `;
      grid.appendChild(div);
    });

    testimoniosAbiertos = true;

  } catch (error) {
    console.error("🔥 Error cargando testimonios:", error);
    grid.innerHTML = "<p>Error al cargar testimonios</p>";
  }
};




