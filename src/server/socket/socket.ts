import http from "http";
import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./events";
import ConnectionManager from "../connection/connectionManager";

export default function injectSocket(server: http.Server) {
  const socket = new Server<ServerToClientEvents, ClientToServerEvents>(
    server,
    {
      cors: {
        credentials: true,
        maxAge: 86400,
      },
    }
  );

    socket.on("connection", (socket) => {
       ConnectionManager.instance.createConnection(socket);
    });

  return socket;
}
