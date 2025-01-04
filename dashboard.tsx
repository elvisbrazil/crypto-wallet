"use client"

import { StatsCards } from "./components/stats-cards"  
import { PortfolioDistribution } from "./components/portfolio-distribution"
import { TokenPriceChart } from "./components/token-price-chart"
import { CryptoNews } from "./components/crypto-news"

export default function Dashboard() {
  return (
    <div className="h-full relative">
      <main className="min-h-screen bg-gray-50">
        <div className="flex-1 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Hello,</h2>
              <p className="text-xl md:text-3xl font-bold text-gray-900">
                Welcome to Crypto Wallet
              </p>
            </div>
          </div>
          <StatsCards />
          <div className="mt-4 md:mt-8 grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-6">
            <div className="col-span-1 md:col-span-3">
              <PortfolioDistribution />
            </div>
            <div className="col-span-1 md:col-span-2">
              <CryptoNews />
            </div>
          </div>
          <div className="mt-4 md:mt-8">
            <TokenPriceChart />
          </div>
        </div>
      </main>
    </div>
  )
}

