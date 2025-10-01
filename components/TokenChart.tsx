'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const mockData = [
  { time: '00:00', price: 0.045 },
  { time: '04:00', price: 0.048 },
  { time: '08:00', price: 0.046 },
  { time: '12:00', price: 0.051 },
  { time: '16:00', price: 0.049 },
  { time: '20:00', price: 0.053 },
  { time: '24:00', price: 0.050 },
]

export default function TokenChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={mockData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis 
          dataKey="time" 
          stroke="#737373" 
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#737373" 
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          }}
          labelStyle={{ color: '#1a1a1a', fontWeight: 600 }}
          itemStyle={{ color: '#14F195' }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#14F195"
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
