"use client";

import { useMarketStore } from "@/stores/useMarketStore";
import React, { useEffect } from "react";
import MarketRow from "../MarketRow";
import { MarketInfo } from "@/types/marketTypes";
import { allSymbols } from "@/constants/data";
import { useQuery } from "@tanstack/react-query";

const TABDEL_API = process.env.NEXT_PUBLIC_TABDEL_API_URL;

const fetchMarkets = async (): Promise<MarketInfo[]> => {
  const symbols = JSON.stringify(allSymbols);
  const url = `${TABDEL_API}exchangeInfo?symbols=${symbols}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch markets");
  return res.json();
};

const TabdealMarkets = () => {
  const subscribe = useMarketStore((s) => s.subscribe);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["markets"],
    queryFn: fetchMarkets,
  });

  useEffect(() => {
    if (data) subscribe(allSymbols);
  }, [data, subscribe]);
  if (isLoading) return <p className="p-6">Loading...</p>;
  if (isError)
    return (
      <p className="p-6 text-red-500">Error: {(error as Error).message}</p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tabdeal Markets</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-6 px-4 text-left">#</th>
              <th className="py-6 px-4 text-left">Symbol</th>
              <th className="py-6 px-4 text-left">Base Asset</th>
              <th className="py-6 px-4 text-left">Quote Asset</th>
              <th className="py-6 px-4 text-left">Status</th>
              <th className="py-6 px-4 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <MarketRow key={item.symbol} item={item} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabdealMarkets;
