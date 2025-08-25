"use client";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import io from "socket.io-client";

type PriceUpdate = { id: string; price: number };

export default function Prices() {
  const socketRef = useRef<Socket | null>(null);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [subscribed, setSubscribed] = useState<string[]>([
    "BTCUSDT",
    "ETHUSDT",
    "DOGEUSDT",
    "BNBUSDT",
    "XRPUSDT",
    "ADAUSDT",
    "SOLUSDT",
    "MATICUSDT",
    "LTCUSDT",
    "USDTIRT",
  ]);

  const allSymbols: string[] = [
    "BTCUSDT",
    "ETHUSDT",
    "DOGEUSDT",
    "BNBUSDT",
    "XRPUSDT",
    "ADAUSDT",
    "SOLUSDT",
    "MATICUSDT",
    "LTCUSDT",
    "USDTIRT",
    "TRXUSDT",
    "SHIBUSDT",
    "DOTUSDT",
    "AVAXUSDT",
  ];

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3000", {
        transports: ["websocket"],
      });
    }
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
      socket.emit("subscribe", subscribed);
    });

    socket.on("priceUpdate", (data: PriceUpdate) => {
      setPrices((prev) => ({ ...prev, [data.id]: data.price }));
    });

    return () => {
      socket.off("priceUpdate");
      socket.off("connect");
    };
  }, [subscribed]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sym = e.target.value;
    if (sym && !subscribed.includes(sym)) {
      setSubscribed([...subscribed, sym]);
      socketRef.current?.emit("subscribe", [sym]); // به سرور هم بفرست
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📈 Live Prices (Tabdeal)</h1>

      <label>
        Add symbol:{" "}
        <select onChange={handleSelect} defaultValue="">
          <option value="">-- Select --</option>
          {allSymbols.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      {Object.keys(prices).length === 0 && <p>Loading...</p>}
      <ul>
        {subscribed.map((symbol) => (
          <li key={symbol}>
            <strong>{symbol}</strong>:{" "}
            {prices[symbol] ? prices[symbol].toFixed(2) : "…"}
          </li>
        ))}
      </ul>
    </div>
  );
}
