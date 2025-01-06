import { useState, useEffect } from 'react';

export const useEthPriceData = () => {
  const [priceData, setPriceData] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);
  const [maxIndex, setMaxIndex] = useState<number>(0);

  const fetchEthPrice = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30&interval=daily'
      );
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      
      const dailyData = data.prices.map(([timestamp, price]: number[]) => {
        const date = new Date(timestamp);
        return {
          date: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          }),
          fullDate: date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          }),
          value: price
        };
      });

      const maxPrice = Math.max(...dailyData.map((item: { value: number }) => item.value));
      const maxIdx = dailyData.findIndex((item: { value: number }) => item.value === maxPrice);
      
      setMaxValue(maxPrice);
      setMaxIndex(maxIdx);
      setPriceData(dailyData);
      setCurrentPrice(dailyData[dailyData.length - 1].value);
    } catch (error) {
      console.error('Error fetching ETH price:', error);
    }
  };

  useEffect(() => {
    fetchEthPrice();
    const interval = setInterval(fetchEthPrice, 300000);
    return () => clearInterval(interval);
  }, []);

  return { priceData, currentPrice, maxValue, maxIndex };
};
