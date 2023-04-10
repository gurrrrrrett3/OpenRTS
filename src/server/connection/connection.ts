import { Socket } from "socket.io";
import Logger from "../../utils/logger";
import { TypedSocket } from "../socket/events";

export default class Connection {

    public id: string = "";

    constructor (public socket: TypedSocket) {
        this.id = socket.id;
    }

}