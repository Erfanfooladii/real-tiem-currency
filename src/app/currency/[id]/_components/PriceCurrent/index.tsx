"use client";
import { useCryptoPrice } from "@/hooks/useGetPrice";

interface PriceCurrentProps {
  symbol: string;
}

const PriceCurrent: React.FC<PriceCurrentProps> = ({ symbol }) => {
  const price = useCryptoPrice(symbol);

  if (price === null) return <span>Loading...</span>;

  return <span>${price.toFixed(2)}</span>;
};

export default PriceCurrent;
