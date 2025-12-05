/* ================================
   IMPORTAR FIREBASE
================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs,
    deleteDoc,
    doc 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/* CONFIG FIREBASE */
const firebaseConfig = {
    apiKey: "AIzaSyCTHFlgEOEBXThDzdTRvk_0BwLjaTwRc7E",
    authDomain: "striped-smile-475414-v0.firebaseapp.com",
    projectId: "striped-smile-475414-v0",
    storageBucket: "striped-smile-475414-v0.appspot.com",
    messagingSenderId: "354814109895",
    appId: "1:354814109895:web:0fce975ddb6c180f1df6e2"
};

// Inicializar app y BD
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/* ================================
   SISTEMA ADMIN OCULTO
================================ */

const adminTrigger = document.getElementById("adminTrigger");

const adminModal = document.createElement("div");
adminModal.id = "adminModal";
adminModal.innerHTML = `
    <div class="modal-content">
        <h2>Modo Administrador</h2>
        <p>Ingresa la clave:</p>
        <input type="password" id="adminPassword" placeholder="Clave...">
        <button class="admin-btn" id="enterAdmin">Entrar</button>
    </div>
`;
document.body.appendChild(adminModal);

adminTrigger.onclick = () => adminModal.style.display = "flex";
adminModal.onclick = (e) => { if (e.target === adminModal) adminModal.style.display = "none"; };

document.addEventListener("click", () => {
    const btn = document.getElementById("enterAdmin");
    if (!btn) return;

    btn.onclick = () => {
        const pass = document.getElementById("adminPassword").value;

        if (pass === "yorkat_admin_25") {
            adminModal.style.display = "none";
            showAdminPanel();
        } else {
            alert("Clave incorrecta");
        }
    };
});


/* ================================
   PANEL ADMIN (ACTUALIZADO)
================================ */

const adminPanel = document.createElement("div");
adminPanel.id = "adminPanel";
adminPanel.innerHTML = `
    <h2>Panel del Administrador</h2>

    <p><strong>Subir nueva publicación</strong></p>
    <input type="file" id="imgInput">
    <textarea id="comentarioInput" placeholder="Comentario..."></textarea>
    <button id="guardarPublicacion">Guardar publicación</button>

    <br><br><hr><br>

    <p><strong>Agregar Testimonio</strong></p>
    <textarea id="testimonioInput" placeholder="Escribe un testimonio..."></textarea>
    <button id="guardarTestimonio">Guardar testimonio</button>
`;
document.body.appendChild(adminPanel);

function showAdminPanel() {
    adminPanel.style.display = "block";
}


/* ================================
   GUARDAR PUBLICACIÓN EN FIRESTORE
================================ */

document.addEventListener("click", () => {
    const btn = document.getElementById("guardarPublicacion");
    if (!btn) return;

    btn.onclick = async () => {
        const archivo = document.getElementById("imgInput").files[0];
        const comentario = document.getElementById("comentarioInput").value;

        if (!archivo) return alert("Selecciona una imagen.");
        if (!comentario) return alert("Escribe un comentario.");

        const lector = new FileReader();
        lector.onload = async (e) => {
            const imgBase64 = e.target.result;
            const fecha = new Date().toISOString();

            await addDoc(collection(db, "publicaciones"), {
                img: imgBase64,
                comentario,
                fecha
            });

            alert("📌 Publicación guardada.");
            mostrarPublicaciones();
        };

        lector.readAsDataURL(archivo);
    };
});


/* ================================
   GUARDAR TESTIMONIO EN FIRESTORE
================================ */

document.addEventListener("click", () => {
    const btn = document.getElementById("guardarTestimonio");
    if (!btn) return;

    btn.onclick = async () => {
        const texto = document.getElementById("testimonioInput").value;

        if (!texto) return alert("Escribe un testimonio.");

        await addDoc(collection(db, "testimonios"), {
            texto: texto,
            fecha: new Date().toISOString()
        });

        alert("📝 Testimonio agregado.");
        mostrarTestimonios();
    };
});


/* ================================
   MOSTRAR PUBLICACIONES
================================ */

async function mostrarPublicaciones() {
    const cont = document.getElementById("galeria-grid");
    cont.innerHTML = "";

    const snap = await getDocs(collection(db, "publicaciones"));
    snap.forEach((docu) => {
        const pub = docu.data();
        const card = document.createElement("div");
        card.classList.add("publicacion");

        card.innerHTML = `
            <img src="${pub.img}">
            <p>${pub.comentario}</p>
            <small>${new Date(pub.fecha).toLocaleDateString()}</small>
            <button onclick="eliminarPublicacion('${docu.id}')" 
            style="margin-top:10px;background:red;color:white;border:none;padding:8px;border-radius:6px;cursor:pointer;">
                Eliminar
            </button>
        `;
        cont.appendChild(card);
    });
}

mostrarPublicaciones();


/* ================================
   MOSTRAR TESTIMONIOS
================================ */

async function mostrarTestimonios() {
    const cont = document.getElementById("testimonios-grid");
    cont.innerHTML = "";

    const snap = await getDocs(collection(db, "testimonios"));
    snap.forEach((docu) => {
        const t = docu.data();
        const card = document.createElement("div");
        card.classList.add("testimonio-card");

        card.innerHTML = `
            <p>"${t.texto}"</p>
            <small>${new Date(t.fecha).toLocaleDateString()}</small>
        `;

        cont.appendChild(card);
    });
}

mostrarTestimonios();


/* ================================
   ELIMINAR PUBLICACIÓN
================================ */

window.eliminarPublicacion = async function(id) {
    if (!confirm("¿Eliminar publicación?")) return;

    await deleteDoc(doc(db, "publicaciones", id));
    mostrarPublicaciones();
};
