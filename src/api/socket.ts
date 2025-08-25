import { NextRequest } from "next/server";
import { Server } from "socket.io";

export const runtime = "node"; // مهم: Node runtime برای WebSocket

let io: Server;

export default function handler(req: any, res: any) {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("New client connected", socket.id);

      socket.on("message", (msg) => {
        console.log("Message received:", msg);
        io.emit("message", msg); // broadcast به همه
      });
    });
  }
  res.end();
}
