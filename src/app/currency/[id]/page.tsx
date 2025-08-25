import { CryptoDetail } from "@/types/crypto";
import React from "react";
import PriceCurrent from "./_components/PriceCurrent";

// Mapping Coingecko id → WebSocket symbol
const coingeckoIdToSymbol: Record<string, string> = {
  bitcoin: "BTCUSDT",
  ethereum: "ETHUSDT",
  dogecoin: "DOGEUSDT",
  binancecoin: "BNBUSDT",
  ripple: "XRPUSDT",
  cardano: "ADAUSDT",
  solana: "SOLUSDT",
  "matic-network": "MATICUSDT",
  litecoin: "LTCUSDT",
  tron: "TRXUSDT",
  "shiba-inu": "SHIBUSDT",
  polkadot: "DOTUSDT",
  "avalanche-2": "AVAXUSDT",
};

interface PageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${params.id}`
  );
  console.log(params.id);

  const data: CryptoDetail = await res.json();

  const wsSymbol = coingeckoIdToSymbol[data?.id]; // symbol for WebSocket

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-6">
        <img
          src={data?.image?.large}
          alt={data?.name}
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold">{data?.name}</h1>
          <p className="text-gray-500 uppercase">{data?.symbol}</p>
          <div className="mt-2 flex gap-2 flex-wrap">
            {data?.categories?.map((cat) => (
              <span
                key={cat}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Price */}
        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="font-semibold">Current Price</h2>
          <div className="text-lg font-bold">
            <PriceCurrent symbol={wsSymbol} />
          </div>
        </div>

        {/* Market Cap */}
        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="font-semibold">Market Cap</h2>
          <p className="text-lg font-bold">
            ${data?.market_data?.market_cap?.usd.toLocaleString()}
          </p>
        </div>

        {/* 24h Volume */}
        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="font-semibold">24h Volume</h2>
          <p className="text-lg font-bold">
            ${data?.market_data?.total_volume?.usd.toLocaleString()}
          </p>
        </div>

        {/* Price Change 24h */}
        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="font-semibold">Price Change 24h</h2>
          <p
            className={`text-lg font-bold ${
              data?.market_data?.price_change_percentage_24h &&
              data?.market_data?.price_change_percentage_24h >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {data?.market_data?.price_change_percentage_24h !== null &&
            data?.market_data?.price_change_percentage_24h !== undefined
              ? data?.market_data?.price_change_percentage_24h.toFixed(2) + "%"
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Description */}
      {data?.description?.en && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{data?.description?.en}</p>
        </div>
      )}
    </div>
  );
};

export default Page;
