import { create } from "zustand";
import ioClient from "socket.io-client";
import { MarketState } from "@/types/marketTypes";

export const useMarketStore = create<MarketState>((set, get) => ({
  prices: {},
  socket: null,
  subscribe: (symbols: string[]) => {
    let socket = get().socket;
    if (!socket) {
      socket = ioClient("http://localhost:3000", {
        transports: ["websocket"],
      });
      socket.on("priceUpdate", (data: { id: string; price: number }) => {
        set((state) => ({
          prices: { ...state.prices, [data.id]: data.price },
        }));
      });
      set({ socket });
    }
    socket.emit("subscribe", symbols);
  },
  unsubscribe: (symbols: string[]) => {
    const socket = get().socket;
    if (socket) socket.emit("unsubscribe", symbols);
  },
}));
