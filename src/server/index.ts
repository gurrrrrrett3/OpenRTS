import express from "express";
import http from "http";
import path from "path";
import injectSocket from "./socket/socket";
import AssetBuilder from "./assets/assetBuilder";

const app = express();

AssetBuilder.buildPack("./src/client/assets");

export const HTTPServer = http.createServer(app);
export const SocketServer = injectSocket(HTTPServer);

app.use(express.static(path.resolve("./src/client/assets")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("./src/client/assets/html/index.html"));
});

app.get("/client", (req, res) => {
  res.sendFile(path.resolve("./dist/bundle.js"));
});

app.get("/assets", (req, res) => {
  res.sendFile(path.resolve("./temp/bundle.pack"));
});

HTTPServer.listen(8080, () => {
  console.log("Server listening on port 8080");
});
