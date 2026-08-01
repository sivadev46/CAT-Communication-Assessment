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
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';
import SkeletonLoader from '../components/Loader/SkeletonLoader';
import RetryButton from '../components/Common/RetryButton';
import { dashboardService } from '../services/dashboardService';
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
      const [statsRes, patientsRes, timelineRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentPatients(),
        dashboardService.getActivityTimeline(),
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
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      id: 'total-patients',
      title: 'Total Patients',
      value: stats.totalPatients?.toString() || '0',
      label: 'Active clinical profiles',
      icon: Users,
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100'
    },
    {
      id: 'todays-assessments',
      title: 'Completed Assessments',
      value: stats.completedAssessments?.toString() || '0',
      label: 'Standardized CAT sessions',
      icon: ClipboardCheck,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100'
    },
    {
      id: 'reports-generated',
      title: 'Reports Generated',
      value: stats.totalReports?.toString() || '0',
      label: 'Clinical diagnostic reports',
      icon: FileText,
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100'
    },
    {
      id: 'pending-reviews',
      title: 'Pending Reviews',
      value: stats.pendingAssessments?.toString() || '0',
      label: 'Requires attention',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100'
    }
  ];

  const quickActions = [
    {
      id: 'new-assessment',
      title: 'New Assessment',
      subtitle: 'Start a new patient assessment',
      icon: PlusCircle,
      path: '/assessment',
      bgColor: 'bg-blue-600 text-white hover:bg-blue-700'
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      subtitle: 'Access patient assessment reports',
      icon: FileText,
      path: '/reports',
      bgColor: 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-200'
    },
    {
      id: 'teaching-videos',
      title: 'Teaching Videos',
      subtitle: 'Browse therapy video modules',
      icon: Video,
      path: '/teaching-videos',
      bgColor: 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-200'
    },
    {
      id: 'vr-assessment',
      title: 'VR Assessment',
      subtitle: 'Launch immersive VR session',
      icon: Glasses,
      path: '/vr',
      bgColor: 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-200'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            In Progress
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            Scheduled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status || 'Active'}
          </span>
        );
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'ASSESSMENT_COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'REPORT_GENERATED':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'PATIENT_ADDED':
        return <Users className="w-4 h-4 text-indigo-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-8">
        <div className="h-20 bg-gray-200/80 rounded-xl animate-pulse" />
        <SkeletonLoader type="stat" />
        <SkeletonLoader count={4} />
      </div>
    );
  }

  if (error) {
    return <RetryButton onRetry={fetchDashboardData} message={error} />;
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Dashboard Top Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back, {user?.fullName || 'Dr. Sarah'}
          </h1>
          <p className="text-sm md:text-base text-blue-600 font-medium mt-1">
            Communication Assessment Tool (CAT)
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-50 px-3.5 py-2 rounded-lg border border-gray-200 self-start md:self-auto">
          <Calendar className="w-4 h-4 text-blue-600" />
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
              className="hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">
                    {card.value}
                  </h2>
                </div>
                <div className={`p-3 rounded-xl ${card.iconBg}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs font-medium text-gray-500 mt-4 flex items-center gap-1">
                {card.label}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Two-Column Layout: Left (Recent Patients) & Right (Quick Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Recent Patients */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Patients</h2>
              <p className="text-xs text-gray-500">Latest active patient assessment profiles</p>
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

          <div className="space-y-3">
            {recentPatients.length === 0 ? (
              <Card className="text-center py-10 px-4">
                <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700">No patients available.</p>
                <p className="text-xs text-gray-500 mt-0.5">Add a patient to begin an assessment.</p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/patients')}
                  className="mt-3 text-xs"
                >
                  Add Patient
                </Button>
              </Card>
            ) : (
              recentPatients.map((patient) => {
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
                    className="hover:shadow-md transition-shadow duration-200 !p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm bg-blue-100 text-blue-700 shadow-xs">
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                          {patient.fullName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {patient.age} yrs • {patient.gender || 'Patient'}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-400">
                            {patient.diagnosis || 'Evaluation pending'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                      {getStatusBadge(patient.status)}
                      <Button
                        variant="outline"
                        onClick={() => navigate('/patients')}
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

        {/* RIGHT COLUMN: Quick Actions */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
            <p className="text-xs text-gray-500">Shortcuts for key clinical tasks</p>
          </div>

          <div className="space-y-3">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => navigate(action.path)}
                  className={`w-full p-4 rounded-xl text-left shadow-xs transition-all duration-200 flex items-center justify-between group cursor-pointer ${action.bgColor}`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-lg bg-black/5">
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

      {/* BOTTOM SECTION: Recent Activities Timeline */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Recent Activities</h2>
          <p className="text-xs text-gray-500">Real-time log of assessments and interactions</p>
        </div>

        <Card className="!p-6">
          <div className="space-y-6">
            {activityTimeline.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">No recent activity logged.</p>
            ) : (
              activityTimeline.map((activity, index) => (
                <div key={activity.id || index} className="relative flex items-start gap-4">
                  {index < activityTimeline.length - 1 && (
                    <span
                      className="absolute top-8 left-4 bottom-[-24px] w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 bg-gray-100">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 bg-gray-50 p-3.5 rounded-lg border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                        {activity.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5">{activity.details}</p>
                    </div>
                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
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
  );
}
