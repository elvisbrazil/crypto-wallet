"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Lock, Unlock, DollarSign, Coins, Fuel } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { useWallet } from '@/hooks/useWallet'
import { useState, useEffect } from 'react'

export function StatsCards() {
  const { walletAddress, balance, tokenCount, toggleWallet, calculateUsdValue, balanceHistory } = useWallet();
  const [gasPrice, setGasPrice] = useState<{
    low: number;
    medium: number;
    high: number;
  }>({ low: 0, medium: 0, high: 0 });

  const fetchGasPrice = async () => {
    try {
      const response = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`);
      const data = await response.json();
      
      if (data.status === "1" && data.result) {
        setGasPrice({
          low: parseInt(data.result.SafeGasPrice),
          medium: parseInt(data.result.ProposeGasPrice),
          high: parseInt(data.result.FastGasPrice)
        });
      }
    } catch (error) {
      console.error('Failed to fetch gas price:', error);
    }
  };

  useEffect(() => {
    fetchGasPrice();
    const interval = setInterval(fetchGasPrice, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="rounded-2xl shadow-sm border-0">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start gap-4">
            <button 
              onClick={toggleWallet}
              className={`p-4 ${walletAddress ? 'bg-[#E5FBDC]' : 'bg-red-100'} rounded-full transition-colors hover:opacity-80`}
            >
              {walletAddress ? (
                <Lock className="h-8 w-8 text-[#63B344]" />
              ) : (
                <Unlock className="h-8 w-8 text-red-500" />
              )}
            </button>
            <div className="space-y-1">
              <p className="text-sm font-onest font-light text-muted-foreground">Wallet</p>
              <div>
                <div className="text-sm font-onest font-light text-muted-foreground">
                  {walletAddress || 'Not connected'}
                </div>
                <div className="text-xl font-onest font-semibold text-[#1e1b4b]">
                  {walletAddress ? 'Connected' : 'Click to connect'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm border-0">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-[#EEF2FF] rounded-full">
                <DollarSign className="h-8 w-8 text-primary-blue" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-onest font-light text-muted-foreground">Balance</p>
                <div className="text-2xl font-onest font-bold text-[#1e1b4b]">{calculateUsdValue()}</div>
                <div className="text-sm font-onest font-light text-muted-foreground">
                  {balance ? `${balance} ETH` : 'Carregando...'}
                </div>
              </div>
            </div>
            <div className="h-[10px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={balanceHistory}>
                  <Line 
                    type="natural" 
                    dataKey="value" 
                    stroke="#4318FF"  
                    strokeWidth={2} 
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm border-0 md:col-span-2 lg:col-span-1">
        <CardContent className="p-4 md:p-6 h-full">
          <div className="flex items-center h-full">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-[#EEF2FF] rounded-full">
                <Coins className="h-8 w-8 text-primary-blue" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-onest font-light text-muted-foreground">Tokens</p>
                <div className="text-2xl font-onest font-bold text-[#1e1b4b]">
                  {walletAddress ? tokenCount : '-'}
                </div>
                <div className="text-sm font-onest font-light text-muted-foreground">
                  ERC20 Tokens
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl shadow-sm border-0 md:col-span-2 lg:col-span-1">
        <CardContent className="p-4 md:p-6 h-full">
          <div className="flex items-center h-full">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-[#EEF2FF] rounded-full">
                <Fuel className="h-8 w-8 text-primary-blue" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-onest font-light text-muted-foreground">Gas</p>
                <div className="text-2xl font-onest font-bold text-[#1e1b4b]">
                  {gasPrice.medium} Gwei
                </div>
                <div className="text-sm font-onest font-light text-muted-foreground">
                  Updated every 10 seconds
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

