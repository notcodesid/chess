import { WebSocket } from "ws";
import { INIT_GAME } from "./messages";
import { Game } from "./Game";

export class GameManager {

    private games : Game[];
    private pendingUser : WebSocket | null;
    private user : WebSocket[]

    constructor() {
        this.games = []
        this.pendingUser = null;
        this.user = [];

    }

    addUser(socket : WebSocket) {
        this.user.push(socket)
        this.addHandler(socket)
    } 
    removeUser(socket : WebSocket) {
        this.user = this.user.filter(user => user !== socket)

    }
    private addHandler( socket : WebSocket) {
        socket.on("message" , (data) => {
            const message = JSON.parse(data.toString());
            if(message.type === INIT_GAME) {
                if(this.pendingUser) {
                    //start a game 
                    const game = new Game(this.pendingUser , socket);
                    this.games.push(game)
                    this.pendingUser = null;
                }
                else{
                    this.pendingUser = socket;
                }
            }
        })


    }

}

