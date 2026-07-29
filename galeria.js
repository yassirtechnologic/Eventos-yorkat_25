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

    // Texto (solo si existe)
    if (data.comentario) {

        const p = document.createElement("p");

        p.textContent = data.comentario;

        card.appendChild(p);

    }

    grid.appendChild(card);

    });

}

/* =====================================================
   COMPARTIR
===================================================== */

const compartir = document.createElement("button");

compartir.className = "btn-compartir";

compartir.innerHTML = "📤 Compartir";

compartir.addEventListener("click", async () => {

    const url = window.location.href;

    if (navigator.share) {

        try {

            await navigator.share({

                title: "Eventos York & Katy",

                text: "Mira esta publicación de Eventos York & Katy",

                url

            });

        } catch (error) {

            console.log("Compartir cancelado");

        }

    } else {

        await navigator.clipboard.writeText(url);

        alert("✅ Enlace copiado al portapapeles.");

    }

});

card.appendChild(compartir);

cargarPublicaciones();


