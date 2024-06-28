import { Chess } from 'chess.js';
import { GAME_OVER, MOVE } from "./messages.js";
var Game = /** @class */ (function () {
    function Game(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        console.log("Game started between Player 1 and Player 2");
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
        // Validation here
        if (this.board.history().length % 2 === 0 && socket !== this.player1)
            return;
        if (this.board.history().length % 2 === 1 && socket !== this.player2)
            return;
        console.log("Move received from ".concat(socket === this.player1 ? 'Player 1' : 'Player 2', ": ").concat(move.from, " to ").concat(move.to));
        try {
            this.board.move(move);
        }
        catch (e) {
            console.log(e);
            return;
        }
        if (this.board.isGameOver()) {
            var winner = this.board.turn() === "w" ? "black" : "white";
            console.log("Game over. Winner: ".concat(winner));
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: { winner: winner }
            }));
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: { winner: winner }
            }));
            return;
        }
        var opponent = (socket === this.player1) ? this.player2 : this.player1;
        console.log("Sending move to opponent: ".concat(opponent === this.player1 ? 'Player 1' : 'Player 2'));
        opponent.send(JSON.stringify({
            type: MOVE,
            payload: move
        }));
    };
    return Game;
}());
export { Game };
