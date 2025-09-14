const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 4000 });

let timer = 25 * 60; // 25 минут
let isRunning = false;

setInterval(() => {
  if (isRunning && timer > 0) {
    timer--;
  }
}, 1000);

wss.on("connection", (ws) => {
  console.log("Новый клиент подключен");

  // отправляем текущее состояние новому клиенту
  ws.send(JSON.stringify({ timer, isRunning }));

  // обработка сообщений от клиента
  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "TOGGLE") {
      isRunning = !isRunning;
    } else if (data.type === "RESET") {
      isRunning = false;
      timer = 25 * 60;
    }
    // рассылаем всем клиентам текущее состояние
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ timer, isRunning }));
      }
    });
  });
});

console.log("WebSocket сервер запущен на ws://localhost:4000");
