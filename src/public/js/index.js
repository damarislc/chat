const socket = io();
document.querySelector("#chat-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const messageInput = document.querySelector("#message");
  const message = messageInput.value;
  messageInput.value = "";
  socket.emit("chatMessage", message);
});

socket.on("message", (data) => {
  const chatMessages = document.querySelector("#chat-messages");
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `<strong>${data.userName}:</strong> ${data.message}`;
  chatMessages.appendChild(messageElement);
});

document.querySelector("#username-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const userNameInput = document.querySelector("#username");
  const userName = userNameInput.value;

  socket.emit("newUser", userName);

  Swal.fire({
    title: "Bienvenido al chat",
    text: `Estas conectado como ${userName}`,
    icon: "success",
  });

  document.querySelector("#username-form").style.display = "none";
  document.querySelector("#chat-form").style.display = "block";
});
