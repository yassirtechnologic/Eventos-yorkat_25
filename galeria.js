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
        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.className = "galeria-video";

        card.appendChild(video);

      } else {

        const img = document.createElement("img");

        img.src = data.imageUrl;
        img.alt = "Publicación";
        img.loading = "lazy";
        img.className = "galeria-img";

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

cargarPublicaciones();


