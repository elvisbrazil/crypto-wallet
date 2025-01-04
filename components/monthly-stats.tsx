"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell, ReferenceLine } from 'recharts'
import { ChartNoAxesColumn, Users } from 'lucide-react'
import { useState } from 'react';

const data = [
  { month: 'Jan', value: 400 },
  { month: 'Fev', value: 300 },
  { month: 'Mar', value: 450 },
  { month: 'Abr', value: 500 },
  { month: 'Mai', value: 480 },
  { month: 'Jun', value: 600 },
  { month: 'Jul', value: 450 },
  { month: 'Ago', value: 500 },
  { month: 'Set', value: 480 },
  { month: 'Out', value: 420 },
  { month: 'Nov', value: 389 },
  { month: 'Dez', value: 400 },
]

export function MonthlyStats() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <Card className="rounded-2xl shadow-sm border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-1xl font-onest font-normal text-gray-400">Novos Convertidos</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Users className="h-8 w-8 text-primary-blue" />
              <span className="text-4xl font-onest font-semibold">682</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-onest font-light text-gray-400">Relatórios</span>
            <ChartNoAxesColumn className="h-8 w-8  text-primary-blue  bg-gray-100 rounded-lg " />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid 
                horizontal={true} 
                vertical={false} 
                strokeDasharray="3 3" 
                stroke="#E2E8F0"
              />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                dy={10}
              />
    
              <Tooltip 
                cursor={{fill: 'rgba(79, 70, 229, 0.1)'}}
                content={({ payload }) => {
                  if (payload && payload.length > 0) {
                    return (
                      <div className="bg-white p-2 font-onest font-light flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary-blue" />
                        <span>{payload[0].value} Novos Convertidos</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine
                y={hoveredValue || maxValue}
                stroke="#4318FF"
                strokeDasharray="3 3"
                label={{
                  position: 'right',
                  value: `${hoveredValue || maxValue} Novos Convertidos`,
                  fill: "#4318FF",
                  fontSize: 12
                }}
                style={{ transition: 'all 0.3s ease' }}
              />
              <Bar 
                dataKey="value" 
                radius={[20, 20, 20, 20]}
                onMouseEnter={(data, index) => {
                  setHoveredBar(index);
                  setHoveredValue(data.value);
                }}
                onMouseLeave={() => {
                  setHoveredBar(null);
                  setHoveredValue(null);
                }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.value === maxValue || index === hoveredBar ? '#4318FF' : '#E2E8F0'}
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

