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

  messages.innerHTML += `<div class="msg"><strong>Tú:</strong> ${input.value}</div>`;

  const prompt = input.value;
  input.value = "";

  const response = await fetch("https://tu-backend-aqui.com/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const data = await response.json();

  messages.innerHTML += `<div class="msg"><strong>Yassir:</strong> ${data.reply}</div>`;
  messages.scrollTop = messages.scrollHeight;
}