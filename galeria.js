/* =====================================================
   🔥 FIREBASE (LECTURA DE PUBLICACIONES)
===================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import { abrirLightbox } from "./lightbox.js";
import { compartirPublicacion } from "./share.js";

/* =====================================================
   🔧 CONFIG
===================================================== */
const firebaseConfig = {
  apiKey: "AIzaSyCTHFlgEOEBXThDzdTRvk_0BwLjaTwRc7E",
  authDomain: "striped-smile-475414-v0.firebaseapp.com",
  projectId: "striped-smile-475414-v0",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* =====================================================
   🖼️ GALERÍA
===================================================== */
const grid = document.getElementById("galeria-grid");

async function cargarPublicaciones() {
  if (!grid) return;

  grid.innerHTML = "";

  const q = query(
    collection(db, "publicaciones"),
    orderBy("fecha", "desc")
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    grid.innerHTML = "<p>No hay publicaciones aún</p>";
    return;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();

    // 🔒 VALIDACIONES CLAVE (evitan /undefined)
    if (!data) return;
    if (!data.imageUrl && !data.comentario) return;

    const card = document.createElement("div");
    card.className = "galeria-item";

    // Imagen o Video
if (data.imageUrl) {

    const esVideo =
        data.tipo === "video" ||
        data.imageUrl.toLowerCase().includes(".mp4") ||
        data.imageUrl.toLowerCase().includes(".mov") ||
        data.imageUrl.toLowerCase().includes(".webm");

    if (esVideo) {

        const video = document.createElement("video");

        video.src = data.imageUrl;
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.controls = false;
        video.className = "galeria-video";
        video.style.cursor = "pointer";

        video.addEventListener("click", () => {

            abrirLightbox("video", data.imageUrl);

        });

        card.appendChild(video);

    } else {

        const img = document.createElement("img");

        img.src = data.imageUrl;
        img.alt = "Publicación";
        img.loading = "lazy";
        img.className = "galeria-img";
        img.style.cursor = "pointer";

        img.addEventListener("click", () => {

            abrirLightbox("imagen", data.imageUrl);

        });

        card.appendChild(img);

    }
}

    /* =====================================================
    ACCIONES
    ===================================================== */

    const acciones = document.createElement("div");

    acciones.className = "galeria-acciones";

    const compartir = document.createElement("button");

    compartir.className = "btn-compartir";

    compartir.innerHTML = "📤 Compartir";

    compartir.addEventListener("click", () => {

        compartirPublicacion(window.location.href);

    });

    acciones.appendChild(compartir);

    card.appendChild(acciones);

    grid.appendChild(card);

    });

    }

    cargarPublicaciones();

/* =====================================================
🍽️ LIGHTBOX — CARTA DE COMIDA
===================================================== */

const imagenesCarta = document.querySelectorAll(".carta-img");

imagenesCarta.forEach((imagen) => {

    // Indica visualmente que la imagen se puede ampliar
    imagen.style.cursor = "zoom-in";

    imagen.addEventListener("click", () => {

        abrirLightbox("imagen", imagen.src);

    });

});

