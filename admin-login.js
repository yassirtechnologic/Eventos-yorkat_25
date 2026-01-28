console.log("🔥 admin-login.js ejecutándose");

/* ==========================================================
   🔥 FIREBASE
========================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

/* ==========================================================
   🔧 CONFIG
========================================================== */
const firebaseConfig = {
  apiKey: "AIzaSyCTHFlgEOEBXThDzdTRvk_0BwLjaTwRc7E",
  authDomain: "striped-smile-475414-v0.firebaseapp.com",
  projectId: "striped-smile-475414-v0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ==========================================================
   🧠 DOM
========================================================== */
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorText = document.getElementById("error");
const btnLogin = document.getElementById("btnLogin");
const resetPass = document.getElementById("resetPass");

/* ==========================================================
   🔐 LOGIN
========================================================== */
btnLogin.addEventListener("click", async () => {
  console.log("👉 Click en Entrar");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!password) {
    errorText.textContent = "Escribe la contraseña";
    return;
  }

  btnLogin.disabled = true;
  btnLogin.textContent = "Entrando...";

  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Login correcto (esperando sesión)");

    // ⏳ Esperar a que Firebase confirme sesión
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ Sesión confirmada:", user.email);
        window.location.href = "admin.html";
      }
    });

  } catch (err) {
    console.error(err);
    errorText.textContent = "Contraseña incorrecta";
    btnLogin.disabled = false;
    btnLogin.textContent = "Entrar";
  }
});

/* ==========================================================
   🔁 RESET PASSWORD
========================================================== */
resetPass.addEventListener("click", async () => {
  try {
    await sendPasswordResetEmail(auth, emailInput.value);
    errorText.textContent = "📩 Revisa tu correo para restablecer la contraseña";
  } catch (err) {
    console.error(err);
    errorText.textContent = "Error al enviar el correo";
  }
});



