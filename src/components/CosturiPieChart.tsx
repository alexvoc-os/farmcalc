'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { RezultatCalcul } from '@/types';

interface CosturiPieChartProps {
  rezultat: RezultatCalcul;
}

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

export default function CosturiPieChart({ rezultat }: CosturiPieChartProps) {
  const data = [
    {
      name: 'Materiale (din operațiuni)',
      value: Math.round(rezultat.totalMaterialeOperatiuni),
      color: COLORS[0]
    },
    {
      name: 'Mecanizare (motorină + retribuții)',
      value: Math.round(rezultat.totalCostMotorina + rezultat.totalRetributii),
      color: COLORS[1]
    },
    {
      name: 'Manoperă',
      value: Math.round(rezultat.costManopera),
      color: COLORS[2]
    },
    {
      name: 'Costuri fixe',
      value: Math.round(rezultat.costuriFixe),
      color: COLORS[3]
    },
  ].filter(item => item.value > 0); // Afișează doar categoriile cu valoare > 0

  // Tooltip custom pentru a afișa valori formatate
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-lg font-bold text-agri-green-700">
            {data.value.toLocaleString('ro-RO')} lei/ha
          </p>
          <p className="text-sm text-gray-500">
            {((data.value / rezultat.costTotal) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Label custom pentru procente pe pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    // Afișează doar dacă procentul e > 5%
    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => (
              <span className="text-sm">
                {value}: <span className="font-semibold">{entry.payload.value.toLocaleString('ro-RO')} lei/ha</span>
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
