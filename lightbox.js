/* ==========================================================
   YASSIR TECH
   LIGHTBOX
========================================================== */

const lightbox = document.createElement("div");

lightbox.id = "lightbox";

lightbox.innerHTML = `
    <div class="lightbox-content">

        <button id="lightboxClose">
            ✕
        </button>

        <div id="lightboxBody"></div>

    </div>
`;

document.body.appendChild(lightbox);

const body = document.getElementById("lightboxBody");

const closeBtn = document.getElementById("lightboxClose");

/* ==========================================================
   ABRIR
========================================================== */

export function abrirLightbox(tipo, url) {

    body.innerHTML = "";

    if (tipo === "video") {

        const video = document.createElement("video");

        video.src = url;

        video.controls = true;

        video.autoplay = true;

        video.playsInline = true;

        body.appendChild(video);

    } else {

        const img = document.createElement("img");

        img.src = url;

        body.appendChild(img);

    }

    lightbox.classList.add("open");

}

/* ==========================================================
   CERRAR
========================================================== */

export function cerrarLightbox(){

    body.innerHTML="";

    lightbox.classList.remove("open");

}

closeBtn.onclick=cerrarLightbox;

lightbox.onclick=(e)=>{

    if(e.target===lightbox){

        cerrarLightbox();

    }

}

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        cerrarLightbox();

    }

});