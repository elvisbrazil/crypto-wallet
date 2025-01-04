"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Sector, Tooltip } from 'recharts'
import { usePortfolioData } from '@/hooks/usePortfolioData'

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

const CustomLegend = ({ data }: { data: TokenBalance[] }) => {
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs font-onest">
      {data.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-1">
          <div 
            className="w-2 h-2 rounded-sm" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.name}</span>
        </li>
      ))}
    </ul>
  );
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export function PortfolioDistribution() {
  const dataWithPercentages = usePortfolioData();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  return (
    <Card className="rounded-2xl shadow-sm border-0">
      <CardHeader className="pb-2">
        <div className="space-y-1">
          <div className="text-gray-500 text-sm font-onest">Portfolio</div>
          <CardTitle className="text-2xl font-onest font-bold text-[#1e1b4b]">
            Distribution
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={dataWithPercentages}
              cx="50%"
              cy="50%"
              innerRadius={60} // Adicionado innerRadius para fazer um donut chart
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              {dataWithPercentages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              content={<CustomTooltip />}
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
          </PieChart>
        </ResponsiveContainer>
        <CustomLegend data={dataWithPercentages} />
      </CardContent>
    </Card>
  );
}
