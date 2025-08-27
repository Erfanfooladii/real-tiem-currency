"use client";

import { useMarketStore } from "@/stores/useMarketStore";
import { MarketInfoSymbol } from "@/types/marketTypes";
import React, { use, useEffect, useState } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}
export default function Page({ params }: PageProps) {
  const { id } = use(params);

  const price = useMarketStore((state) => state.prices[id]);
  const subscribe = useMarketStore((s) => s.subscribe);
  const [market, setMarket] = useState<MarketInfoSymbol | null>(null);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const symbols = encodeURIComponent(JSON.stringify([id]));
        const url = `https://api1.tabdeal.org/r/api/v1/exchangeInfo?symbols=${symbols}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch market info");
        const data = await res.json();
        setMarket(data?.[0]);
        subscribe([id]);
      } catch (err) {
        console.error("Error fetching market:", err);
      }
    };
    fetchMarket();
  }, [id, subscribe]);

  if (!market) {
    return <p className="p-6">Loading market info...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        {market.baseAsset}/{market.quoteAsset}{" "}
        <span className="text-gray-500 text-lg ml-2">({market.symbol})</span>
      </h1>

      <div className="p-4 border rounded-xl shadow-sm bg-gray-50">
        <h2 className="font-semibold">Current Price</h2>
        <p className="text-2xl font-bold text-blue-600">
          {price ? `${price} ${market.quoteAsset}` : "Loading..."}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-xl shadow-sm">
          <h2 className="font-semibold">Status</h2>
          <p
            className={
              market.status === "TRADING"
                ? "text-green-600 font-bold"
                : "text-red-600 font-bold"
            }
          >
            {market.status}
          </p>
        </div>

        <div className="p-4 border rounded-xl shadow-sm">
          <h2 className="font-semibold">Tabdeal Symbol</h2>
          <p>{market.tabdealSymbol}</p>
        </div>

        <div className="p-4 border rounded-xl shadow-sm">
          <h2 className="font-semibold">Base / Quote</h2>
          <p>
            {market.baseAsset} / {market.quoteAsset}
          </p>
        </div>
      </div>

      {market.orderTypes && (
        <div className="p-4 border rounded-xl shadow-sm">
          <h2 className="font-semibold mb-2">Order Types</h2>
          <ul className="flex flex-wrap gap-2">
            {market.orderTypes.map((type) => (
              <li
                key={type}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {type}
              </li>
            ))}
          </ul>
        </div>
      )}

      {market.permissions && (
        <div className="p-4 border rounded-xl shadow-sm">
          <h2 className="font-semibold mb-2">Permissions</h2>
          <ul className="flex flex-wrap gap-2">
            {market.permissions.map((p) => (
              <li
                key={p}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
