'use client';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart as HBarChart,
} from 'recharts';


const COLORS = {
  New:       'var(--chart-1)',
  Contacted: 'var(--chart-5)',
  Qualified: 'var(--chart-4)',
  Converted: 'var(--chart-2)',
  Lost:      'var(--chart-3)',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-md px-3 py-2 shadow-md text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      <p className="text-muted-foreground">{payload[0].value} leads</p>
    </div>
  );
};

export default function AnalyticsPage() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetch('/api/leads/stats')
      .then(r => r.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load analytics');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <p className="text-sm text-muted-foreground">Loading analytics…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }


  const pieData = [
    { name: 'New',       value: stats.new },
    { name: 'Contacted', value: stats.contacted },
    { name: 'Qualified', value: stats.qualified },
    { name: 'Converted', value: stats.converted },
    { name: 'Lost',      value: stats.lost },
  ].filter(d => d.value > 0);


  const funnelData = [
    { name: 'New',       value: stats.new,       fill: COLORS.New },
    { name: 'Contacted', value: stats.contacted,  fill: COLORS.Contacted },
    { name: 'Qualified', value: stats.qualified,  fill: COLORS.Qualified },
    { name: 'Converted', value: stats.converted,  fill: COLORS.Converted },
    { name: 'Lost',      value: stats.lost,       fill: COLORS.Lost },
  ];

  return (
    <div className="p-6 space-y-6">

      
      <div>
        <h1 className="text-xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Real time insights from your leads
        </p>
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Total Leads
          </p>
          <p className="text-3xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Conversion Rate
          </p>
          <p className="text-3xl font-bold text-chart-2">
            {stats.conversionRate}%
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Converted
          </p>
          <p className="text-3xl font-bold text-chart-2">
            {stats.converted}
          </p>
        </div>
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <h2 className="text-sm font-semibold mb-1">Leads by Month</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Total leads added per month this year
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.byMonth} barSize={20}>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                width={24}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
              <Bar
                dataKey="count"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

       
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <h2 className="text-sm font-semibold mb-1">Status Breakdown</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Distribution of leads by current status
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map(entry => (
                  <Cell
                    key={entry.name}
                    fill={`var(--chart-${
                      entry.name === 'New'       ? 1 :
                      entry.name === 'Contacted' ? 5 :
                      entry.name === 'Qualified' ? 4 :
                      entry.name === 'Converted' ? 2 : 3
                    })`}
                  />
                ))}
              </Pie>
              <Legend
                formatter={v => (
                  <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{v}</span>
                )}
              />
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

       
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm col-span-full">
          <h2 className="text-sm font-semibold mb-1">Conversion Funnel</h2>
          <p className="text-xs text-muted-foreground mb-4">
            How leads move through each stage
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <HBarChart
              data={funnelData}
              layout="vertical"
              barSize={20}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {funnelData.map(entry => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </HBarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}