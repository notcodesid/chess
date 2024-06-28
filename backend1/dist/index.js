import { WebSocketServer } from 'ws';
import GameManager from './GameManager.js';
var wss = new WebSocketServer({ port: 8080 });
var gameManager = new GameManager();
wss.on('connection', function connection(ws) {
    gameManager.addUser(ws);
    ws.on("close", function () { return gameManager.removeUser(ws); });
});
