/* ==========================================================
   YASSIR TECH
   SHARE COMPONENT
========================================================== */

/**
 * Comparte una publicación.
 * Si el navegador soporta Web Share API,
 * abre el menú nativo.
 * En caso contrario copia el enlace.
 */
export async function compartirPublicacion(url) {

    const titulo = "Eventos York & Katy";

    const texto = "Mira esta publicación de Eventos York & Katy";

    if (navigator.share) {

        try {

            await navigator.share({

                title: titulo,

                text: texto,

                url

            });

        } catch (error) {

            console.log("Compartir cancelado.");

        }

    } else {

        try {

            await navigator.clipboard.writeText(url);

            alert("✅ Enlace copiado al portapapeles.");

        } catch {

            alert("No fue posible compartir.");

        }

    }

}