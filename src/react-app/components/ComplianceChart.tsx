import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';

interface RiskTrend {
  date: string;
  high: number;
  medium: number;
  low: number;
}

interface DSARTrend {
  date: string;
  received: number;
  completed: number;
}

interface ComplianceChartProps {
  riskTrends: RiskTrend[];
  dsarTrends: DSARTrend[];
  complianceScore: number;
}

const RISK_COLORS = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981',
};

const COMPLIANCE_COLORS = ['#3B82F6', '#E5E7EB'];

export default function ComplianceChart({ riskTrends, dsarTrends, complianceScore }: ComplianceChartProps) {
  const complianceData = [
    { name: 'Compliant', value: complianceScore },
    { name: 'Non-compliant', value: 100 - complianceScore },
  ];

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Risk Trends Chart */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={riskTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={formatDate}
              />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                }}
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
              />
              <Area
                type="monotone"
                dataKey="high"
                stackId="1"
                stroke={RISK_COLORS.high}
                fill={RISK_COLORS.high}
                fillOpacity={0.8}
                name="High Risk"
              />
              <Area
                type="monotone"
                dataKey="medium"
                stackId="1"
                stroke={RISK_COLORS.medium}
                fill={RISK_COLORS.medium}
                fillOpacity={0.8}
                name="Medium Risk"
              />
              <Area
                type="monotone"
                dataKey="low"
                stackId="1"
                stroke={RISK_COLORS.low}
                fill={RISK_COLORS.low}
                fillOpacity={0.8}
                name="Low Risk"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DSAR Trends Chart */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Subject Request Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dsarTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={formatDate}
              />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                }}
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
              />
              <Area
                type="monotone"
                dataKey="received"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.8}
                name="Received"
              />
              <Area
                type="monotone"
                dataKey="completed"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.8}
                name="Completed"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compliance Score */}
      <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Compliance Score</h3>
        <div className="flex items-center justify-center">
          <div className="relative">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={complianceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {complianceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COMPLIANCE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{complianceScore.toFixed(1)}%</div>
                <div className="text-sm text-gray-500">Compliant</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span className="text-sm text-gray-600">Needs Attention</span>
          </div>
        </div>
      </div>
    </div>
  );
}
