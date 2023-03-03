const socket = io("http://localhost:8080");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");

const name = prompt("What is your name");
appendMessage(`<div class="init-message" >You joined</div>`);
socket.emit("new-user", name);



socket.on("chat-message", function (data) {
  console.log(data);
  appendMessage(`<div class='user-text-other'>${data.name}:${data.message}</div>`);
});

socket.on("user-connected", function (name) {
  console.log(name);
  appendMessage(`${name} connected`);
});

socket.on("user-disconnected", function (name) {
  console.log(name);
  appendMessage(`${name} disconnected`);
});



messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`<div class='user-text-me'>You: ${message}</div>`);

  socket.emit("send-chat-message", message);
  messageInput.value = "";
});


function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = message;
  messageContainer.append(messageElement);
}







