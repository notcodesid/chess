import { WebSocket } from "ws";
import { Chess } from 'chess.js';
import { GAME_OVER, MOVE } from "./messages.js";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    private startTime: Date;

    constructor(player1: WebSocket, player2: WebSocket) {
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

    makeMove(socket: WebSocket, move: { from: string, to: string }) {
        // Validation here
        if (this.board.history().length % 2 === 0 && socket !== this.player1) return;
        if (this.board.history().length % 2 === 1 && socket !== this.player2) return;

        console.log(`Move received from ${socket === this.player1 ? 'Player 1' : 'Player 2'}: ${move.from} to ${move.to}`);

        try {
            this.board.move(move);
        } catch (e) {
            console.log(e);
            return;
        }

        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? "black" : "white";
            console.log(`Game over. Winner: ${winner}`);
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: { winner }
            }));
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: { winner }
            }));
            return;
        }

        const opponent = (socket === this.player1) ? this.player2 : this.player1;
        console.log(`Sending move to opponent: ${opponent === this.player1 ? 'Player 1' : 'Player 2'}`);
        opponent.send(JSON.stringify({
            type: MOVE,
            payload: move
        }));
    }
}
