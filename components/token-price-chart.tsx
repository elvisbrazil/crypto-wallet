"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, ReferenceLine, CartesianGrid, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { DollarSign } from 'lucide-react'

export function TokenPriceChart() {
  const [priceData, setPriceData] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [maxValue, setMaxValue] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
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


      type DailyData = {
        value: number;
      
      };

      // Encontrar o índice do valor máximo
      const maxPrice = Math.max(...dailyData.map((item: DailyData) => item.value));
      const maxIdx = dailyData.findIndex((item: DailyData) => item.value === maxPrice);
      
      setMaxValue(maxPrice);
      setMaxIndex(maxIdx);
      setHoveredValue(maxPrice);
      setActiveIndex(maxIdx);
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{payload[0].value.toFixed(2)}%</span> of portfolio
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="rounded-2xl shadow-sm border-0">
      <CardHeader className="pb-2">
        <div className="space-y-1">
          <div className="text-gray-500 text-sm font-onest">ETH Price</div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-2xl font-onest font-bold text-[#1e1b4b]">
              ${currentPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </CardTitle>
            <span className="text-sm font-onest text-gray-500">Last 30 Days</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priceData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" stroke="#E2E8F0" />
              <ReferenceLine 
                y={hoveredValue || maxValue} 
                stroke="#4318FF" 
                strokeDasharray="3 3"
                label={{
                  position: 'right',
                  value: `$${(hoveredValue || maxValue).toLocaleString()}`,
                  fill: '#4318FF',
                  fontSize: 12
                }}
              />
              <XAxis 
                dataKey="date"
                axisLine={false}
                tickLine={false}
                dy={10}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(67, 24, 255, 0.1)' }}
                content={({ payload }) => {
                  if (payload && payload.length) {
                    return (
                      <div className="bg-white p-2 font-onest font-light">
                        <div className="text-xs text-gray-500 mb-1">{payload[0].payload.fullDate}</div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-primary-blue" />
                          {payload && payload[0] && payload[0].value !== undefined && (
                            <span>{payload[0].value.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              maximumFractionDigits: 2
                            })}</span>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="value"
                radius={[20, 20, 20, 20]}
                onMouseEnter={(data, index) => {
                  setHoveredValue(data.value);
                  setActiveIndex(index);
                }}
                onMouseLeave={() => {
                  setHoveredValue(maxValue);
                  setActiveIndex(maxIndex);
                }}
              >
                {priceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === activeIndex ? '#4318FF' : '#E2E8F0'}
                    style={{ transition: 'fill 0.3s ease' }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
