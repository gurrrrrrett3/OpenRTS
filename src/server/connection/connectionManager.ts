import { TypedSocket } from "../socket/events";
import Connection from "./connection";
import Logger from "../../utils/logger";

export default class ConnectionManager {
  private static _instance: ConnectionManager;

  public connections: Map<string, Connection> = new Map();

  public static get instance(): ConnectionManager {
    if (!this._instance) {
      this._instance = new ConnectionManager();
    }
    return this._instance;
  }

  private constructor() {}

  public createConnection(connection: TypedSocket) {
    this.connections.set(connection.id, new Connection(connection));

    connection.on("disconnect", () => {
      this.removeConnection(connection);
    });

    connection.on("error", (error) => {
      Logger.error("ConnectionManager", `Socket error: ${error}`);
    });

    Logger.info("ConnectionManager", `New connection established: ${connection.id}`);
  }

  public removeConnection(connection: TypedSocket | Connection) {
    Logger.info("ConnectionManager", `Connection closed: ${connection.id}`);
    this.connections.delete(connection.id);
  }
}
