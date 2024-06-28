import { INIT_GAME, MOVE } from "./messages.js";
import { Game } from "./Game.js";
var GameManager = /** @class */ (function () {
    function GameManager() {
        this.games = [];
        this.pendingUser = null;
        this.user = [];
    }
    GameManager.prototype.addUser = function (socket) {
        this.user.push(socket);
        this.addHandler(socket);
    };
    GameManager.prototype.removeUser = function (socket) {
        this.user = this.user.filter(function (user) { return user !== socket; });
    };
    GameManager.prototype.addHandler = function (socket) {
        var _this = this;
        socket.on("message", function (data) {
            var message = JSON.parse(data.toString());
            if (message.type === INIT_GAME) {
                if (_this.pendingUser) {
                    //start a game 
                    var game = new Game(_this.pendingUser, socket);
                    _this.games.push(game);
                    _this.pendingUser = null;
                }
                else {
                    _this.pendingUser = socket;
                }
            }
            if (message.type === MOVE) {
                var game = _this.games.find(function (game) { return game.player1 === socket || game.player2 === socket; });
                if (game) {
                    game.makeMove(socket, message.move);
                }
            }
        });
    };
    return GameManager;
}());
export default GameManager;
