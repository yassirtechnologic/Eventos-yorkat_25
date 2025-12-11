/* ==========================================================
   🌐 SISTEMA DE IDIOMAS — Eventos York & Katy
   Optimizado y ampliado por ChatGPT (versión PRO)
   ========================================================== */

/* ==========================================================
   1️⃣ FUNCIÓN PRINCIPAL PARA CAMBIAR DE IDIOMA
========================================================== */
function setLanguage(lang) {
    if (!translations[lang]) lang = "es"; // Seguridad

    localStorage.setItem("language", lang);

    translateTextContent(lang);
    translatePlaceholders(lang);
    translateHTML(lang);
    updateSEO(lang);
}

/* ==========================================================
   2️⃣ TRADUCCIÓN DE TEXTOS (solo textContent)
========================================================== */
function translateTextContent(lang) {
    document.querySelectorAll("[data-translate]").forEach((el) => {
        const key = el.getAttribute("data-translate");

        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

/* ==========================================================
   3️⃣ TRADUCIR PLACEHOLDERS
========================================================== */
function translatePlaceholders(lang) {
    document.querySelectorAll("[data-translate-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-translate-placeholder");

        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
}

/* ==========================================================
   4️⃣ TRADUCIR BLOQUES COMPLETOS CON HTML
   Ideal para la sección "Sobre Nosotros"
========================================================== */
function translateHTML(lang) {
    document.querySelectorAll("[data-translate-html]").forEach((el) => {
        const key = el.getAttribute("data-translate-html");

        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });
}

/* ==========================================================
   5️⃣ SEO BILINGÜE (TITLE, DESCRIPTION, OG TAGS)
========================================================== */
const seoData = {
    es: {
        title: "Eventos York & Katy",
        description: "Organización de eventos, decoración, catering, música y fotografía en Mallorca y Nicaragua."
    },
    en: {
        title: "York & Katy Events",
        description: "Event planning, decoration, catering, music and photography in Mallorca and Nicaragua."
    }
};

function updateSEO(lang) {
    const data = seoData[lang];

    if (!data) return;

    // <title>
    const titleTag = document.getElementById("dynamic-title");
    if (titleTag) titleTag.textContent = data.title;

    // Meta description
    const descTag = document.getElementById("dynamic-description");
    if (descTag) descTag.setAttribute("content", data.description);

    // Open Graph
    const ogTitle = document.getElementById("og-title");
    if (ogTitle) ogTitle.setAttribute("content", data.title);

    const ogDesc = document.getElementById("og-description");
    if (ogDesc) ogDesc.setAttribute("content", data.description);

    // JSON-LD Schema
    const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": data.title,
        "description": data.description,
        "url": "https://yorkandkat.com",
        "logo": "https://yorkandkat.com/assets/logo.png",
        "areaServed": ["Spain", "Nicaragua"]
    };

    const schemaTag = document.getElementById("seo-schema");
    if (schemaTag) schemaTag.textContent = JSON.stringify(schema, null, 2);
}

/* ==========================================================
   6️⃣ CARGAR IDIOMA AL ABRIR LA PÁGINA
========================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("language") || "es";
    setLanguage(savedLang);
});


