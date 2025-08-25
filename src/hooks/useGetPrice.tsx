"use client";
import { PriceUpdate } from "@/types/crypto";
import { useEffect, useRef, useState } from "react";
import ioClient from "socket.io-client";

export function useCryptoPrice(symbol: string) {
  const socketRef = useRef<any>(null);
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = ioClient("http://localhost:3000", {
        transports: ["websocket"],
      });
    }

    const socket = socketRef.current;

    socket.emit("subscribe", [symbol]);

    const handler = (data: PriceUpdate) => {
      if (data.id === symbol) {
        setPrice(data.price);
      }
    };

    socket.on("priceUpdate", handler);

    return () => {
      socket.emit("unsubscribe", [symbol]);
      socket.off("priceUpdate", handler);
    };
  }, [symbol]);

  return price;
}
