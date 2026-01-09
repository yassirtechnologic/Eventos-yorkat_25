function openChat() {
  document.getElementById("chat-overlay").classList.remove("hidden");
}

function closeChat() {
  document.getElementById("chat-overlay").classList.add("hidden");
}

async function sendMessage() {
  const input = document.getElementById("prompt");
  const messages = document.getElementById("messages");

  if (!input.value.trim()) return;

  const userMessage = input.value;

  messages.innerHTML += `
    <div class="msg-row user">
      <div class="chat-bubble user">${userMessage}</div>
    </div>
  `;

  input.value = "";
  messages.scrollTop = messages.scrollHeight;

  try {
    const response = await fetch(
      "https://yassirbot-backend.onrender.com/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage })
      }
    );

    const data = await response.json();

    messages.innerHTML += `
      <div class="msg-row bot">
        <div class="chat-bubble bot">${data.reply}</div>
      </div>
    `;

    messages.scrollTop = messages.scrollHeight;

  } catch (error) {
    messages.innerHTML += `
      <div class="msg-row bot">
        <div class="chat-bubble bot">
          ❌ Error de conexión con el servidor
        </div>
      </div>
    `;
  }
}
