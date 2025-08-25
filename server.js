// server.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const WebSocket = require("ws");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, { cors: { origin: "*" } });

  let tabdealWs = null;
  let subscribedSymbols = new Set();

  const connectTabdeal = () => {
    if (tabdealWs) {
      tabdealWs.terminate();
      tabdealWs = null;
    }
    if (subscribedSymbols.size === 0) return;

    tabdealWs = new WebSocket("wss://api1.tabdeal.org/stream/");

    tabdealWs.on("open", () => {
      console.log("✅ Connected to Tabdeal WS");

      tabdealWs.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: Array.from(subscribedSymbols).map(
            (s) => `${s.toLowerCase()}@depth@2000ms`
          ),
          id: 1,
        })
      );
    });

    tabdealWs.on("message", (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw.toString());
      } catch (e) {
        return;
      }
      if (!msg.data || !msg.data.b || !msg.data.a) return;

      const symbol = msg.data.s;
      const bid = msg.data.b?.[0]?.[0];
      const ask = msg.data.a?.[0]?.[0];
      if (bid && ask) {
        const mid = (parseFloat(bid) + parseFloat(ask)) / 2;
        io.emit("priceUpdate", { id: symbol, price: mid });
      }
    });

    tabdealWs.on("close", () => {
      console.log("⚠️ Tabdeal WS closed, reconnecting...");
      setTimeout(connectTabdeal, 3000);
    });

    tabdealWs.on("error", (err) => {
      console.error("❌ Tabdeal WS error:", err.message);
      setTimeout(connectTabdeal, 3000);
    });
  };

  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    socket.on("subscribe", (symbols) => {
      let added = false;
      symbols.forEach((s) => {
        if (!subscribedSymbols.has(s)) {
          subscribedSymbols.add(s);
          added = true;
        }
      });
      if (added) connectTabdeal();
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
      if (io.engine.clientsCount === 0 && tabdealWs) {
        tabdealWs.terminate();
        tabdealWs = null;
        subscribedSymbols.clear();
      }
    });
  });

  server.listen(3000, () =>
    console.log("🚀 Server listening on http://localhost:3000")
  );
});
