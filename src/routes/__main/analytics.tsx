import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatCard } from '@/components/shared/stat-card'
import {
    Activity,
    Crown,
    Ticket,
    UsersRound,
} from 'lucide-react'
import { useState } from 'react'
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    BarChart,
    Bar,
} from 'recharts'
import { PageHeader } from '#/components/shared/page-header'


// Mock chart data for different intervals
const CHART_DATA_OPTIONS = {
    '7days': [
        { name: 'Jan', value: 4500 },
        { name: 'Feb', value: 4800 },
        { name: 'Mar', value: 8000 },
        { name: 'Apr', value: 5200 },
        { name: 'May', value: 8200 },
        { name: 'Jun', value: 6500 },
        { name: 'Jul', value: 10500 },
    ]
}


const REVENUE_DATA = [
    { name: 'Jan', value: 3000 },
    { name: 'Feb', value: 4500 },
    { name: 'Mar', value: 10000 },
    { name: 'Apr', value: 14500 },
    { name: 'May', value: 18500 },
    { name: 'Jun', value: 24000 },
    { name: 'Jul', value: 29000 },
]

export const Route = createFileRoute('/__main/analytics')({
  component: RouteComponent,
})

function RouteComponent() {
    const [timeframe, setTimeframe] = useState<'7days'>('7days')
    const chartData = CHART_DATA_OPTIONS[timeframe]

    return (
        <div className="flex flex-col gap-4">
            <PageHeader title="Analytics" description="View system and application metrics" />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard
                    label="Total App Downloads"
                    value="14,820"
                    icon={Ticket}
                    color="orange"
                />
                <StatCard
                    label="Active Users"
                    value="2,140"
                    icon={UsersRound}
                    color="orange"
                />
                <StatCard
                    label="Paid conversion Rate"
                    value="52"
                    icon={Activity}
                    color="orange"
                />
                <StatCard
                    label="Premium Users"
                    value="4.8%"
                    icon={Crown}
                    color="orange"
                />
                <StatCard
                    label="Revenue This Month"
                    value="$3,250"
                    icon={Ticket}
                    color="orange"
                />
            </div>
    
            {/* Charts Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                {/* User Growth Chart */}
                <Card className="border border-border/50 shadow-sm p-4 flex flex-col gap-4">
                    <CardHeader className="p-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pb-4 border-b">
                        <div>
                            <CardTitle className="text-lg font-semibold tracking-tight">
                                User Growth
                            </CardTitle>
                        </div>
                        <Select value={timeframe} onValueChange={(val) => setTimeframe(val as '7days')}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder={'Last 7 days'} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7days">Last 7 days</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="h-64 p-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(17, 17, 17, 0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'rgba(17, 17, 17, 0.5)', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '3 3' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#f97316"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#colorGrowth)"
                                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#f97316' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
    
                {/* Revenue Trend */}
                <Card className="border border-border/50 shadow-sm p-4 flex flex-col gap-4">
                    <CardHeader className="p-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pb-4 border-b">
                        <div>
                            <CardTitle className="text-lg font-semibold tracking-tight">
                                Monthly Revenue
                            </CardTitle>
                        </div>
                        <Select value={timeframe} onValueChange={(val) => setTimeframe(val as '7days')}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder={'Last 7 days'} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7days">Last 7 days</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="h-64 p-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(17, 17, 17, 0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'rgba(17, 17, 17, 0.5)', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'rgba(17, 17, 17, 0.5)', fontSize: 11, fontWeight: 500 }}
                                    tickFormatter={(val) => `$${val/1000}k`}
                                    dx={-5}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(17,17,17,0.05)' }}
                                />
                                <Bar 
                                    dataKey="value" 
                                    radius={[4, 4, 0, 0]}
                                    barSize={24}
                                >
                                    {REVENUE_DATA.map((_, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={index % 2 === 0 ? '#6d6158' : '#f97316'} 
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
