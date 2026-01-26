import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export function GentleParentingCharts() {
  const cooperationData = [
    { label: 'Traditional Discipline', value: 37.5 },
    { label: 'Gentle Parenting', value: 60 },
  ];

  const tantrumDonut = [
    { name: 'Tantrums Reduced', value: 42 },
    { name: 'Remaining Baseline', value: 58 },
  ];

  const cooperationDonut = [
    { name: 'Cooperation Gained', value: 60 },
    { name: 'Baseline', value: 40 },
  ];

  const lineData = [
    { week: 'Week 0', incidents: 10 },
    { week: 'Week 1', incidents: 8.5 },
    { week: 'Week 2', incidents: 7.5 },
    { week: 'Week 3', incidents: 6.5 },
    { week: 'Week 4', incidents: 5.8 },
  ];

  const COLORS = {
    primary: '#81C784',
    secondary: '#4CAF50',
    accentLight: '#C8E6C9',
    text: '#2E7D32',
    gray: '#B0BEC5',
  };

  return (
    <section aria-label="Charts: Gentle Parenting impact" className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <figure className="bg-white rounded-xl border border-slate-200 p-4" aria-labelledby="gp-coop-title">
          <figcaption id="gp-coop-title" className="text-sm text-slate-600 mb-2">
            Reported cooperation: traditional 37.5% vs gentle 60%
          </figcaption>
          <div className="h-56">
            <ChartContainer
              config={{ value: { label: 'Cooperation' } }}
              className="h-full"
            >
              <ResponsiveContainer>
                <BarChart
                  data={cooperationData}
                  layout="vertical"
                  margin={{ top: 4, right: 12, bottom: 4, left: 12 }}
                  role="img"
                  aria-label="Horizontal bar chart comparing cooperation rates"
                >
                  <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: COLORS.text }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={140}
                    tick={{ fill: COLORS.text }}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={4}>
                    {cooperationData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? COLORS.gray : COLORS.primary}
                        stroke={index === 0 ? COLORS.gray : COLORS.secondary}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </figure>

        <figure className="bg-white rounded-xl border border-slate-200 p-4" aria-labelledby="gp-tantrum-title">
          <figcaption id="gp-tantrum-title" className="text-sm text-slate-600 mb-2">
            42% fewer tantrums after 30 days
          </figcaption>
          <div className="h-56">
            <ChartContainer config={{}} className="h-full">
              <ResponsiveContainer>
                <PieChart role="img" aria-label="Donut showing tantrum reduction">
                  <Tooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={tantrumDonut}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {tantrumDonut.map((entry, index) => (
                      <Cell
                        key={`slice-${index}`}
                        fill={index === 0 ? COLORS.secondary : COLORS.accentLight}
                        stroke="#FFFFFF"
                        strokeWidth={3}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </figure>

        <figure className="bg-white rounded-xl border border-slate-200 p-4" aria-labelledby="gp-coopdonut-title">
          <figcaption id="gp-coopdonut-title" className="text-sm text-slate-600 mb-2">
            60% cooperation gained from improved connection
          </figcaption>
          <div className="h-56">
            <ChartContainer config={{}} className="h-full">
              <ResponsiveContainer>
                <PieChart role="img" aria-label="Donut showing cooperation gain">
                  <Tooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={cooperationDonut}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {cooperationDonut.map((entry, index) => (
                      <Cell
                        key={`slice-${index}`}
                        fill={index === 0 ? COLORS.primary : COLORS.accentLight}
                        stroke="#FFFFFF"
                        strokeWidth={3}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </figure>
      </div>

      <figure className="bg-white rounded-xl border border-slate-200 p-4" aria-labelledby="gp-line-title">
        <figcaption id="gp-line-title" className="text-sm text-slate-600 mb-2">
          Tantrum incidents trend while applying gentle parenting techniques
        </figcaption>
        <div className="h-72">
          <ChartContainer config={{}} className="h-full">
            <ResponsiveContainer>
              <LineChart
                data={lineData}
                margin={{ top: 10, right: 12, bottom: 8, left: 0 }}
                role="img"
                aria-label="Line chart showing weekly tantrum reduction"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fill: COLORS.text }} />
                <YAxis tick={{ fill: COLORS.text }} />
                <Tooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="incidents"
                  stroke={COLORS.secondary}
                  strokeWidth={3}
                  dot={{ r: 4, stroke: COLORS.secondary, fill: COLORS.secondary }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </figure>
    </section>
  );
}
