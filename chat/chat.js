function openChat() {
  document.getElementById("chat-overlay").classList.remove("hidden");
}

function closeChat() {
  document.getElementById("chat-overlay").classList.add("hidden");
}

async function sendMessage() {
  const input = document.getElementById("prompt");
  const messages = document.getElementById("messages");

  if (!input.value) return;

  const userMessage = input.value;

  messages.innerHTML += `
    <div class="msg">
      <strong>Tú:</strong> ${userMessage}
    </div>
  `;

  input.value = "";

  try {
    const response = await fetch(
      "https://yassirbot-backend.onrender.com/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage
        })
      }
    );

    const data = await response.json();

    messages.innerHTML += `
      <div class="msg">
        <strong>Yassir:</strong> ${data.reply}
      </div>
    `;

    messages.scrollTop = messages.scrollHeight;

  } catch (error) {
    messages.innerHTML += `
      <div class="msg">
        <strong>Error:</strong> No se pudo conectar con el servidor.
      </div>
    `;
  }
}