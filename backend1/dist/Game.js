import { Chess } from 'chess.js';
import { GAME_OVER, MOVE } from "./messages.js";
var Game = /** @class */ (function () {
    function Game(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: "init_game",
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: "init_game",
            payload: {
                color: "black"
            }
        }));
    }
    Game.prototype.makeMove = function (socket, move) {
        // vaildation here
        if (this.board.moves.length % 2 === 0 && socket !== this.player1)
            return;
        if (this.board.moves.length % 2 === 1 && socket !== this.player2)
            return;
        try {
            this.board.move(move);
        }
        catch (e) {
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        }
        if (this.board.moves.length % 2 === 0) {
            this.player2.emit(JSON.stringify({
                type: "move",
                payload: MOVE
            }));
        }
        else {
            this.player1.emit(JSON.stringify({
                type: move,
                payload: MOVE
            }));
        }
    };
    return Game;
}());
export { Game };
