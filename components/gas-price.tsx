"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Flame } from 'lucide-react'

export function GasPrice() {
  const [gasPrice, setGasPrice] = useState<{
    low: number;
    medium: number;
    high: number;
  }>({ low: 0, medium: 0, high: 0 });

  const fetchGasPrice = async () => {
    try {
      const response = await fetch('https://api.etherscan.io/api', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        next: { revalidate: 10 },
      });

      const data = await response.json();
      const price = parseInt(data.result.SafeGasPrice);
      
      setGasPrice({
        low: price,
        medium: Math.round(price * 1.2),
        high: Math.round(price * 1.5)
      });
    } catch (error) {
      console.error('Failed to fetch gas price:', error);
    }
  };

  useEffect(() => {
    fetchGasPrice();
    const interval = setInterval(fetchGasPrice, 10000); // Atualiza a cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="rounded-2xl shadow-sm border-0">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-orange-100 rounded-full">
            <Flame className="h-8 w-8 text-orange-500" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-onest font-light text-muted-foreground">Gas Price</p>
            <div className="flex gap-3 text-sm font-onest">
              <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">
                {gasPrice.low} gwei
              </span>
              <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                {gasPrice.medium} gwei
              </span>
              <span className="px-2 py-1 rounded-full bg-red-100 text-red-700">
                {gasPrice.high} gwei
              </span>
            </div>
            <div className="text-xs font-onest text-muted-foreground">
              Low · Average · High
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
