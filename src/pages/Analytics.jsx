import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  Video,
  Award,
  Calendar,
  User,
  Activity,
  ArrowUpRight,
  Filter,
  Download
} from 'lucide-react';
import Header from '../components/Header/Header';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';

// Mock Analytics Data
const categoryPerformanceData = [
  { category: 'Eye Contact', score: 82, benchmark: 75 },
  { category: 'Joint Attention', score: 78, benchmark: 70 },
  { category: 'Receptive Lang', score: 71, benchmark: 68 },
  { category: 'Expressive Lang', score: 65, benchmark: 65 },
  { category: 'Social Interact', score: 76, benchmark: 72 },
];

const monthlyTrendData = [
  { month: 'Feb', completed: 42, pending: 18, total: 60 },
  { month: 'Mar', completed: 58, pending: 22, total: 80 },
  { month: 'Apr', completed: 65, pending: 19, total: 84 },
  { month: 'May', completed: 78, pending: 25, total: 103 },
  { month: 'Jun', completed: 88, pending: 28, total: 116 },
  { month: 'Jul', completed: 94, pending: 34, total: 128 },
];

const completionStatusData = [
  { name: 'Completed', value: 94, color: '#2563eb' },
  { name: 'Pending', value: 34, color: '#f59e0b' },
  { name: 'In Progress', value: 12, color: '#10b981' },
];

// Mock Patient Timeline Data
const patientProgressData = {
  'PAT-1024': {
    name: 'Eleanor Vance',
    age: 6,
    diagnosis: 'Autism Spectrum Disorder (Level 1)',
    history: [
      { date: 'Jul 24, 2026', type: 'VR Assessment', score: '78%', evaluator: 'Dr. Sarah Jenkins', status: 'Completed' },
      { date: 'Jun 12, 2026', type: 'Standard Evaluation', score: '71%', evaluator: 'Mark Davis, SLP', status: 'Completed' },
      { date: 'May 02, 2026', type: 'Baseline Assessment', score: '62%', evaluator: 'Dr. Sarah Jenkins', status: 'Completed' },
    ],
    improvement: '+16% over 3 months',
    recentReports: ['Comprehensive Clinical Evaluation', 'Caregiver Action Summary', 'VR Behavioral Observations'],
  },
  'PAT-1025': {
    name: 'Marcus Brody',
    age: 8,
    diagnosis: 'Expressive Language Delay',
    history: [
      { date: 'Jul 18, 2026', type: 'Standard Evaluation', score: '84%', evaluator: 'Laura Adams, SLP', status: 'Completed' },
      { date: 'May 20, 2026', type: 'Follow-up Assessment', score: '76%', evaluator: 'Laura Adams, SLP', status: 'Completed' },
    ],
    improvement: '+8% over 2 months',
    recentReports: ['Expressive Syntax Progress Report', 'Caregiver Home Guide'],
  },
};

export default function Analytics() {
  const [selectedPatientId, setSelectedPatientId] = useState('PAT-1024');
  const [timeframe, setTimeframe] = useState('6M');

  const activePatient = patientProgressData[selectedPatientId];

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Analytics & Clinical Progress"
        subtitle="Comprehensive clinical metrics, communication trends, and patient progression analysis."
      />

      {/* Top Controls & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-bold text-gray-900">Clinical Overview Dashboard</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Period:</span>
          {['1M', '3M', '6M', '1Y'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                timeframe === tf
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tf}
            </button>
          ))}
          <Button variant="outline" className="text-xs py-1 px-3 flex items-center gap-1 ml-2">
            <Download className="w-3.5 h-3.5" /> Export Data
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="!p-4 border border-blue-100 bg-blue-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase">Total Patients</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">128</p>
          <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +12% this month
          </span>
        </Card>

        <Card className="!p-4 border border-emerald-100 bg-emerald-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">94</p>
          <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> 73.4% completion
          </span>
        </Card>

        <Card className="!p-4 border border-amber-100 bg-amber-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase">Pending</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">34</p>
          <span className="text-[10px] font-medium text-amber-700 mt-1 block">Scheduled evaluations</span>
        </Card>

        <Card className="!p-4 border border-indigo-100 bg-indigo-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase">Reports</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">88</p>
          <span className="text-[10px] font-medium text-indigo-700 mt-1 block">Clinical & Caregiver</span>
        </Card>

        <Card className="!p-4 border border-purple-100 bg-purple-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase">Videos Viewed</span>
            <Video className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">412</p>
          <span className="text-[10px] font-medium text-purple-700 mt-1 block">Training modules</span>
        </Card>

        <Card className="!p-4 border border-teal-100 bg-teal-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase">Avg. Score</span>
            <Award className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">74.5%</p>
          <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +4.2% cohort growth
          </span>
        </Card>
      </div>

      {/* Main Charts Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Performance Bar Chart (2 Cols) */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Category-wise Communication Performance</h3>
              <p className="text-xs text-gray-500">Average patient score vs clinical benchmark per domain</p>
            </div>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">
              5 Domains
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryPerformanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="score" name="Cohort Score (%)" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="benchmark" name="Benchmark (%)" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Assessment Completion Rate Pie Chart (1 Col) */}
        <Card className="space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900">Assessment Completion Distribution</h3>
            <p className="text-xs text-gray-500">Status ratio across 140 total battery sessions</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {completionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Monthly Trend Area Chart & Patient Timeline Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Trend (2 Cols) */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Monthly Assessment Velocity Trend</h3>
              <p className="text-xs text-gray-500">Completed vs Pending assessments over the last 6 months</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              +28% Volume Growth
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="#2563eb" fillOpacity={1} fill="url(#colorCompleted)" />
                <Area type="monotone" dataKey="pending" name="Pending" stroke="#f59e0b" fillOpacity={1} fill="url(#colorPending)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Individual Patient Progress Timeline (1 Col) */}
        <Card className="space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Patient Progress Tracking</h3>
              <p className="text-xs text-gray-500">Individual longitudinal evaluation record</p>
            </div>
          </div>

          {/* Patient Switcher Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase">Select Patient Record:</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-semibold focus:ring-2 focus:ring-blue-500"
            >
              <option value="PAT-1024">Eleanor Vance (Age 6 • ASD)</option>
              <option value="PAT-1025">Marcus Brody (Age 8 • Language Delay)</option>
            </select>
          </div>

          {/* Active Patient Highlights */}
          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-blue-900">{activePatient.name}</span>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {activePatient.improvement}
              </span>
            </div>
            <p className="text-[11px] text-gray-600">{activePatient.diagnosis}</p>
          </div>

          {/* Timeline list */}
          <div className="space-y-3 pt-1">
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Evaluation History</h4>
            <div className="space-y-2.5 relative pl-4 border-l-2 border-blue-200">
              {activePatient.history.map((item, idx) => (
                <div key={idx} className="relative space-y-0.5">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">{item.type}</span>
                    <span className="text-xs font-black text-blue-600">{item.score}</span>
                  </div>
                  <p className="text-[11px] text-gray-500">{item.date} • {item.evaluator}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reports List */}
          <div className="pt-2 border-t border-gray-100 space-y-1.5">
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Linked Reports</h4>
            <div className="space-y-1">
              {activePatient.recentReports.map((rep, i) => (
                <div key={i} className="text-xs text-gray-700 flex items-center justify-between p-1.5 bg-gray-50 rounded-md">
                  <span className="truncate">{rep}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
