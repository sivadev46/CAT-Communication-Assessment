import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ClipboardCheck,
  FileText,
  Clock,
  PlusCircle,
  Video,
  Glasses,
  CheckCircle2,
  Share2,
  PlayCircle,
  ChevronRight,
  Calendar
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';
import SkeletonLoader from '../components/Loader/SkeletonLoader';
import RetryButton from '../components/Common/RetryButton';
import VideoPlayerModal from '../components/Modal/VideoPlayerModal';
import { dashboardService } from '../services/dashboardService';
import { assessmentService } from '../services/assessmentService';
import { submissionService } from '../services/submissionService';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    totalPatients: 0,
    completedAssessments: 0,
    pendingAssessments: 0,
    totalReports: 0,
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [activityTimeline, setActivityTimeline] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [chartRange, setChartRange] = useState('7'); // '7', '14', or '30' days

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, patientsRes, timelineRes, assessmentsRes, submissionsRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentPatients(),
        dashboardService.getActivityTimeline(),
        assessmentService.getAssessmentsByPatient('all').catch((err) => {
          console.error('Failed to load assessments:', err);
          return { success: true, data: { assessments: [] } };
        }),
        submissionService.getSubmissions().catch((err) => {
          console.error('Failed to load submissions:', err);
          return { success: true, data: [] };
        }),
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
      if (patientsRes.success && patientsRes.data) {
        setRecentPatients(patientsRes.data);
      }
      if (timelineRes.success && timelineRes.data) {
        setActivityTimeline(timelineRes.data);
      }
      if (assessmentsRes.success && assessmentsRes.data) {
        setAssessments(assessmentsRes.data.assessments || []);
      }
      if (submissionsRes.success && submissionsRes.data) {
        setSubmissions(submissionsRes.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmissionCallback = (updatedSub) => {
    setSubmissions((prev) =>
      prev.map((s) => (s._id === updatedSub._id ? updatedSub : s))
    );
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute Recharts Area Chart Data dynamically from real assessment data
  const chartData = React.useMemo(() => {
    const rangeInt = parseInt(chartRange, 10);
    const days = [];
    const dateMap = {};

    // Initialize date ranges backwards from today
    for (let i = rangeInt - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toDateString();
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const name = rangeInt > 14
        ? `${d.getDate()}`
        : d.toLocaleDateString('en-US', { weekday: 'short' });

      days.push({
        dateString,
        name,
        label,
        count: 0
      });
      dateMap[dateString] = days.length - 1;
    }

    // Map completed assessments
    assessments.forEach((ass) => {
      if (ass.status === 'Completed') {
        const assDate = new Date(ass.assessmentDate || ass.createdAt);
        const assDateString = assDate.toDateString();
        if (dateMap[assDateString] !== undefined) {
          days[dateMap[assDateString]].count += 1;
        }
      }
    });

    return days;
  }, [assessments, chartRange]);

  const completedLabel = React.useMemo(() => {
    switch (chartRange) {
      case '14':
        return 'Completed assessments in the last 14 days';
      case '30':
        return 'Completed assessments this month';
      case '7':
      default:
        return 'Completed assessments this week';
    }
  }, [chartRange]);

  const completedCount = React.useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.count, 0).toString();
  }, [chartData]);

  const statCards = [
    {
      id: 'total-patients',
      title: 'Total Patients',
      value: stats.totalPatients?.toString() || '0',
      label: 'Active clinical profiles',
      icon: Users,
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/30 dark:text-blue-450 dark:border-blue-900/50'
    },
    {
      id: 'todays-assessments',
      title: 'Completed Assessments',
      value: completedCount,
      label: completedLabel,
      icon: ClipboardCheck,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-450 dark:border-emerald-900/50'
    },
    {
      id: 'reports-generated',
      title: 'Reports Generated',
      value: stats.totalReports?.toString() || '0',
      label: 'Clinical diagnostic reports',
      icon: FileText,
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-450 dark:border-indigo-900/50'
    },
    {
      id: 'pending-reviews',
      title: 'Pending Reviews',
      value: stats.pendingAssessments?.toString() || '0',
      label: 'Requires attention',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/30 dark:text-amber-450 dark:border-amber-900/50'
    }
  ];

  const quickActions = [
    {
      id: 'new-assessment',
      title: 'New Assessment',
      subtitle: 'Start a new patient assessment',
      icon: PlusCircle,
      path: '/assessment',
      bgColor: 'bg-blue-600 text-white hover:bg-blue-700 border-transparent'
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      subtitle: 'Access patient assessment reports',
      icon: FileText,
      path: '/reports',
      bgColor: 'bg-white text-gray-800 hover:bg-gray-50 border-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-750'
    },
    {
      id: 'vr-assessment',
      title: 'VR Assessment',
      subtitle: 'Launch immersive VR session',
      icon: Glasses,
      path: '/vr',
      bgColor: 'bg-white text-gray-800 hover:bg-gray-50 border-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-750'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
            In Progress
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
            Scheduled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-transparent dark:border-slate-700">
            {status || 'Active'}
          </span>
        );
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'ASSESSMENT_COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'REPORT_GENERATED':
        return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'PATIENT_ADDED':
        return <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600 dark:text-slate-400" />;
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-3 rounded-lg shadow-md transition-colors duration-200">
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400">{payload[0].payload.label}</p>
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">
            Completed: {payload[0].value} {payload[0].value === 1 ? 'assessment' : 'assessments'}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    return (
      <Card className="flex flex-col h-[380px] justify-between transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Assessment activity</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">{completedLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">Range:</span>
            <select
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value)}
              className="text-xs font-medium bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="7">Last 7 days</option>
              <option value="14">Last 14 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </div>
        </div>

        <div className="flex-1 w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-slate-800/40" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorCount)"
                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 1.5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-8">
        <div className="h-20 bg-gray-200/80 dark:bg-slate-850 rounded-xl animate-pulse" />
        <SkeletonLoader type="stat" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[380px] bg-gray-200/80 dark:bg-slate-850 rounded-xl animate-pulse" />
          <div className="lg:col-span-1 h-[380px] bg-gray-200/80 dark:bg-slate-850 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return <RetryButton onRetry={fetchDashboardData} message={error} />;
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Dashboard Top Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800/85 shadow-xs transition-colors duration-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
            Welcome back, {user?.fullName || 'Dr. Sarah'}
          </h1>
          <p className="text-sm md:text-base text-blue-600 dark:text-blue-400 font-medium mt-1">
            Communication Assessment Tool (CAT)
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 px-3.5 py-2 rounded-lg border border-gray-200 dark:border-slate-700 self-start md:self-auto transition-colors duration-200">
          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* Four Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card
              key={card.id}
              className="hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-2 tracking-tight">
                    {card.value}
                  </h2>
                </div>
                <div className={`p-3 rounded-xl ${card.iconBg}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mt-4 flex items-center gap-1">
                {card.label}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Grid ROW 1: Assessment Graph & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Graph (2 columns) */}
        <div className="lg:col-span-2">
          {renderChart()}
        </div>

        {/* Right: Recent Activity (1 column) */}
        <div className="flex flex-col h-[380px] justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Recent Activities</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">Real-time log of assessments and interactions</p>
            </div>
          </div>

          <Card className="flex-1 overflow-hidden !p-4 transition-colors duration-200">
            <div className="space-y-3">
              {activityTimeline.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-slate-400 text-center py-4">No recent activity logged.</p>
              ) : (
                activityTimeline.slice(0, 4).map((activity, index) => (
                  <div key={activity.id || index} className="relative flex items-start gap-3">
                    {index < Math.min(activityTimeline.length, 4) - 1 && (
                      <span
                        className="absolute top-7 left-3.5 bottom-[-12px] w-0.5 bg-gray-200 dark:bg-slate-800"
                        aria-hidden="true"
                      />
                    )}
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 bg-gray-100 dark:bg-slate-850 border border-gray-200/50 dark:border-slate-800 transition-colors duration-200">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 bg-gray-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-gray-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 transition-colors duration-200">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-gray-900 dark:text-slate-200 leading-tight truncate">
                          {activity.title}
                        </h4>
                        <p className="text-[10px] text-gray-600 dark:text-slate-400 mt-0.5 truncate">{activity.details}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium whitespace-nowrap self-end sm:self-center">
                        {activity.timestamp
                          ? new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Recently'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Grid ROW 2: Recent Patients & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Patients (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Recent Patients</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">Latest active patient assessment profiles</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/patients')}
              className="text-xs flex items-center gap-1"
            >
              View All Patients
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {recentPatients.length === 0 ? (
              <Card className="text-center py-10 px-4">
                <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700 dark:text-slate-200">No patients available.</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Add a patient to begin an assessment.</p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/patients')}
                  className="mt-3 text-xs"
                >
                  Add Patient
                </Button>
              </Card>
            ) : (
              recentPatients.slice(0, 4).map((patient) => {
                const initials = patient.fullName
                  ? patient.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                  : 'PT';

                return (
                  <Card
                    key={patient._id || patient.id}
                    className="hover:shadow-md transition-all duration-200 !p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 shadow-xs transition-colors duration-200">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-slate-200 text-sm leading-tight truncate">
                          {patient.fullName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500 dark:text-slate-400">
                            {patient.age} yrs • {patient.gender || 'Patient'}
                          </span>
                          <span className="text-gray-300 dark:text-slate-700">•</span>
                          <span className="text-xs text-gray-405 dark:text-slate-500 truncate max-w-[150px] sm:max-w-none">
                            {patient.diagnosis || 'Evaluation pending'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 dark:border-slate-800/80 transition-colors duration-200">
                      {getStatusBadge(patient.status)}
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/patients`)}
                        className="py-1.5 px-3 text-xs"
                      >
                        View
                      </Button>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Quick Actions (1 column) */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Quick Actions</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">Shortcuts for key clinical tasks</p>
          </div>

          <div className="space-y-3">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => navigate(action.path)}
                  className={`w-full p-4 rounded-xl text-left shadow-xs transition-all duration-200 flex items-center justify-between group cursor-pointer border ${action.bgColor}`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-lg bg-black/5 dark:bg-white/5">
                      <ActionIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm leading-tight">{action.title}</h3>
                      <p className="text-xs opacity-75 mt-0.5">{action.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid ROW 3: Patient Practice Recordings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Patient Practice Recordings</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Home activities recorded by parents for clinical observation and review
            </p>
          </div>
          <span className="text-xs font-semibold text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-2.5 py-1 rounded-lg">
            {submissions.length} Total Submissions
          </span>
        </div>

        {submissions.length === 0 ? (
          <Card className="text-center py-10 px-4">
            <Video className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold text-gray-700 dark:text-slate-200">No practice recordings submitted yet.</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              When caregivers practice and submit home videos, they will appear here for clinical review.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {submissions.map((sub) => (
              <Card
                key={sub._id || sub.id}
                className="hover:shadow-md transition-all duration-200 !p-4 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 truncate max-w-[170px]">
                      {sub.patientId?.fullName || 'Patient'}
                    </span>
                    {sub.status === 'Reviewed' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                        Reviewed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                        Pending Review
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-sm leading-snug line-clamp-2">
                    {sub.activityTitle}
                  </h3>

                  <div className="text-[11px] text-gray-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                    <span>{new Date(sub.sentAt || sub.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Duration: {sub.formattedDuration || '0:15'}</span>
                    <span>•</span>
                    <span>Caregiver: {sub.parentId?.fullName || 'Parent'}</span>
                  </div>

                  {sub.notes && (
                    <p className="text-[11px] text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-800/60 p-2 rounded-lg italic line-clamp-2">
                      "{sub.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedSubmission(sub);
                      setIsVideoModalOpen(true);
                    }}
                    className="text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <PlayCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>View Recording</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Video Player Modal for Clinician */}
      <VideoPlayerModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        submission={selectedSubmission}
        isClinicianView={true}
        onReviewed={handleReviewSubmissionCallback}
      />
    </div>
  );
}
