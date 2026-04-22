import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts'
import { format, startOfMonth, eachDayOfInterval, endOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'

const SalesChart = ({ sales, monthlyGoal }) => {
  const today = new Date()
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)
  
  const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  const salesByDay = allDays.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd')
    const daySales = sales.filter(sale => 
      format(new Date(sale.created_at), 'yyyy-MM-dd') === dayStr
    )
    const total = daySales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0)
    
    return {
      date: format(day, 'dd/MM'),
      ventas: total,
      meta: monthlyGoal / allDays.length,
    }
  })

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{payload[0].payload.date}</p>
          <p className="text-secondary">
            Ventas: ${payload[0].value.toLocaleString('es-CL')}
          </p>
          {payload[1] && (
            <p className="text-primary">
              Meta diaria: ${payload[1].value.toLocaleString('es-CL')}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Ventas vs Meta Mensual
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={salesByDay}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            stroke="#888"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#888"
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="ventas" 
            fill="#00B894" 
            radius={[8, 8, 0, 0]}
            name="Ventas"
          />
          <Line 
            type="monotone" 
            dataKey="meta" 
            stroke="#6C5CE7" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Meta Diaria"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SalesChart
