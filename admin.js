/* ==========================================================
   FIREBASE IMPORTS
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
   FIREBASE CONFIG
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
   ABRIR PANEL ADMIN DESDE index.html (CON CLAVE SECRETA)
========================================================== */
const adminTrigger = document.getElementById("adminTrigger");

if (adminTrigger) {
    adminTrigger.onclick = () => {
        const clave = prompt("Ingrese la clave de administrador:");

        if (clave === "yorkat_admin_25") {
            window.location.href = "admin.html";
        } else {
            alert("Clave incorrecta");
        }
    };
}

/* ==========================================================
   FUNCIONES PARA admin.html
========================================================== */

/* ===========================
   1. GUARDAR PUBLICACIÓN
=========================== */
export async function guardarPublicacion() {
    const comentario = document.getElementById("pubComentario").value;
    const archivo = document.getElementById("pubImagen")?.files[0];

    if (!comentario) return alert("Escribe un comentario.");

    let imagenBase64 = "";

    if (archivo) {
        const reader = new FileReader();
        reader.readAsDataURL(archivo);
        await new Promise(res => reader.onload = res);
        imagenBase64 = reader.result;
    }

    await addDoc(collection(db, "publicaciones"), {
        comentario,
        img: imagenBase64,
        fecha: new Date().toISOString()
    });

    alert("Publicación guardada correctamente.");
    document.getElementById("pubComentario").value = "";
    if (archivo) document.getElementById("pubImagen").value = "";

    mostrarPublicaciones();
}

/* ===========================
   2. GUARDAR TESTIMONIO
=========================== */
export async function guardarTestimonioAdmin() {
    const nombre = document.getElementById("testNombre").value;
    const texto = document.getElementById("testTexto").value;
    const estrellas = document.getElementById("testEstrellas").value;

    if (!nombre || !texto || !estrellas) {
        return alert("Completa todos los campos.");
    }

    await addDoc(collection(db, "testimonios"), {
        nombre,
        texto,
        estrellas: parseInt(estrellas),
        fecha: new Date().toISOString()
    });

    alert("Testimonio agregado correctamente.");
    document.getElementById("testNombre").value = "";
    document.getElementById("testTexto").value = "";
    document.getElementById("testEstrellas").value = "";

    mostrarTestimonios();
}

/* ===========================
   3. MOSTRAR PUBLICACIONES
=========================== */
export async function mostrarPublicaciones() {
    const cont = document.getElementById("adminListaPublicaciones");
    if (!cont) return;

    cont.innerHTML = "";

    const snap = await getDocs(collection(db, "publicaciones"));

    snap.forEach((docu) => {
        const pub = docu.data();

        cont.innerHTML += `
            <div class="admin-card">
                ${pub.img ? `<img src="${pub.img}" class="admin-img">` : ""}
                <p>${pub.comentario}</p>
                <small>${new Date(pub.fecha).toLocaleString()}</small>

                <button class="btn-delete" onclick="eliminarPublicacion('${docu.id}')">
                    Eliminar
                </button>
            </div>
        `;
    });
}

/* ===========================
   4. MOSTRAR TESTIMONIOS
=========================== */
export async function mostrarTestimonios() {
    const cont = document.getElementById("adminListaTestimonios");
    if (!cont) return;

    cont.innerHTML = "";

    const snap = await getDocs(collection(db, "testimonios"));

    snap.forEach((docu) => {
        const t = docu.data();

        cont.innerHTML += `
            <div class="admin-card">
                <h4>${t.nombre}</h4>
                <p>${t.texto}</p>
                <p>⭐ ${t.estrellas}</p>
                <small>${new Date(t.fecha).toLocaleString()}</small>

                <button class="btn-delete" onclick="eliminarTestimonio('${docu.id}')">
                    Eliminar
                </button>
            </div>
        `;
    });
}

/* ===========================
   5. ELIMINAR PUBLICACIÓN
=========================== */
window.eliminarPublicacion = async function(id) {
    if (!confirm("¿Eliminar publicación?")) return;

    await deleteDoc(doc(db, "publicaciones", id));
    mostrarPublicaciones();
}

/* ===========================
   6. ELIMINAR TESTIMONIO
=========================== */
window.eliminarTestimonio = async function(id) {
    if (!confirm("¿Eliminar testimonio?")) return;

    await deleteDoc(doc(db, "testimonios", id));
    mostrarTestimonios();
}

/* ==========================================================
   AUTO-CARGA EN admin.html
========================================================== */
if (window.location.pathname.includes("admin.html")) {
    mostrarPublicaciones();
    mostrarTestimonios();
}

