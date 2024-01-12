const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());

class Client {
  constructor(socket) {
    this.socket = socket;
    this.countdownValue = 0;
    this.countdownInterval = null;
  }
}

const clients = new Set();

wss.on('connection', (socket) => {
  console.log('WebSocket connection established');

  const client = new Client(socket);
  clients.add(client);

  // Send the initial timer value to the newly connected client
  client.socket.send(client.countdownValue.toString());

  client.socket.on('message', (message) => {
    const receivedMessage = message.toString('utf-8');
    console.log('Received:', receivedMessage);

    if (receivedMessage === 'Start timer' && !client.countdownInterval) {
      console.log('Starting countdown...');
      startCountdown(client);
    } else if (receivedMessage.startsWith('Join timer with code:')) {
      const code = receivedMessage.replace('Join timer with code:', '').trim();
      console.log('Attempting to join with code:', code);

      const sharedClient = findClientByCode(code);

      if (sharedClient) {
        console.log('Joining shared countdown...');
        startCountdown(client, sharedClient.countdownValue);
      } else {
        console.log('Invalid code or countdown not found.');
      }
    }
  });

  client.socket.on('close', () => {
    console.log('WebSocket connection closed');
    clients.delete(client);
  });
});

function startCountdown(client, initialCountdown = 20 * 60) {
  client.countdownValue = initialCountdown;

  client.countdownInterval = setInterval(() => {
    if (client.socket.readyState === WebSocket.OPEN) {
      client.socket.send(client.countdownValue.toString());
    }

    console.log('Countdown:', client.countdownValue);

    client.countdownValue--;

    if (client.countdownValue < 0) {
      clearInterval(client.countdownInterval);
      client.countdownInterval = null;
    }
  }, 1000);
}

function findClientByCode(code) {
  return Array.from(clients).find(client => client.countdownValue > 0 && client.countdownValue <= 20 * 60 && client.countdownValue);
}

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
