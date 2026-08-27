import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  ClipboardCheck,
  FileText,
  Users,
  ChevronRight,
  Calendar,
  History,
  TrendingUp,
  Clock,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';
import SkeletonLoader from '../components/Loader/SkeletonLoader';
import RetryButton from '../components/Common/RetryButton';
import { assessmentService } from '../services/assessmentService';
import { reportService } from '../services/reportService';

export default function AssessmentHistory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [assessments, setAssessments] = useState([]);
  const [reports, setReports] = useState([]);
  const [dateRange, setDateRange] = useState('all');

  const fetchHistoryData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [assessmentsRes, reportsRes] = await Promise.all([
        assessmentService.getAssessmentsByPatient('all'),
        reportService.getReports().catch((err) => {
          console.error('Failed to load reports:', err);
          return { success: true, data: [] };
        })
      ]);

      if (assessmentsRes.success && assessmentsRes.data) {
        setAssessments(assessmentsRes.data.assessments || []);
      }
      if (reportsRes.success && reportsRes.data) {
        setReports(reportsRes.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assessment history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  // Filter completed assessments with date range limits
  const completedAssessments = useMemo(() => {
    let result = assessments.filter((ass) => ass.status === 'Completed');

    if (dateRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      if (dateRange === '7days') {
        cutoffDate.setDate(now.getDate() - 7);
      } else if (dateRange === '30days') {
        cutoffDate.setDate(now.getDate() - 30);
      } else if (dateRange === '3months') {
        cutoffDate.setMonth(now.getMonth() - 3);
      }

      result = result.filter((ass) => {
        const assDate = new Date(ass.assessmentDate || ass.createdAt);
        return assDate >= cutoffDate;
      });
    }

    return result;
  }, [assessments, dateRange]);

  // Create a map of assessment ID to report ID
  const assessmentReportMap = useMemo(() => {
    const map = {};
    reports.forEach((rep) => {
      if (rep.assessment) {
        const assId = rep.assessment._id || rep.assessment;
        map[assId] = rep._id || rep.id;
      }
    });
    return map;
  }, [reports]);

  // Score distribution data for BarChart (latest 8 completed assessments)
  const scoreDistributionData = useMemo(() => {
    return completedAssessments
      .slice(0, 8)
      .reverse() // Chronological order: oldest to newest
      .map((ass) => {
        const rawScore = ass.overallPercentage || (ass.overallScore ? (ass.overallScore > 100 ? (ass.overallScore / 5) : ass.overallScore) : 0);
        const percentageScore = Math.min(100, Math.max(0, Math.round(rawScore)));
        return {
          id: ass._id,
          name: ass.patient?.fullName || 'Patient',
          patientName: ass.patient?.fullName || 'Patient',
          score: percentageScore,
          date: new Date(ass.assessmentDate || ass.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })
        };
      });
  }, [completedAssessments]);

  // Skills profile donut chart data (Present vs Growing skills)
  const skillsProfileData = useMemo(() => {
    let presentCount = 0;
    let growingCount = 0;

    completedAssessments.forEach((ass) => {
      const skills = [
        ass.eyeContact || 0,
        ass.jointAttention || 0,
        ass.receptiveLanguage || 0,
        ass.expressiveLanguage || 0,
        ass.socialInteraction || 0
      ];

      skills.forEach((score) => {
        if (score >= 75) {
          presentCount++;
        } else {
          growingCount++;
        }
      });
    });

    const total = presentCount + growingCount;
    if (total === 0) return [];

    return [
      { name: 'Present Skills (75%+)', value: presentCount, color: '#10b981' }, // Emerald
      { name: 'Growing Skills (<75%)', value: growingCount, color: '#3b82f6' }   // Blue
    ];
  }, [completedAssessments]);

  // Handle report redirection
  const handleViewReport = (assessmentId) => {
    const reportId = assessmentReportMap[assessmentId];
    if (reportId) {
      navigate('/reports', { state: { highlightReportId: reportId } });
    } else {
      navigate('/reports');
    }
  };

  // Calculate improvement trend relative to previous completed assessment
  const getAssessmentTrend = (currentAss) => {
    const patientId = currentAss.patient?._id || currentAss.patient;
    if (!patientId) return null;

    // Find all completed assessments for the same patient
    const patientAsses = assessments.filter(
      ass => ass.status === 'Completed' && (ass.patient?._id === patientId || ass.patient === patientId)
    );

    // Sort chronologically (oldest to newest)
    const sorted = [...patientAsses].sort((a, b) => {
      const dateA = new Date(a.assessmentDate || a.createdAt);
      const dateB = new Date(b.assessmentDate || b.createdAt);
      return dateA - dateB;
    });

    const currentIndex = sorted.findIndex(ass => ass._id === currentAss._id);
    if (currentIndex <= 0) return null;

    const prevAss = sorted[currentIndex - 1];
    const currentScore = currentAss.overallPercentage || (currentAss.overallScore ? (currentAss.overallScore > 100 ? (currentAss.overallScore / 5) : currentAss.overallScore) : 0);
    const prevScore = prevAss.overallPercentage || (prevAss.overallScore ? (prevAss.overallScore > 100 ? (prevAss.overallScore / 5) : prevAss.overallScore) : 0);

    const diff = currentScore - prevScore;
    const roundedDiff = Math.round(diff * 10) / 10;

    return {
      diff: roundedDiff,
      text: roundedDiff > 0 
        ? `↑ ${roundedDiff}% improvement` 
        : roundedDiff < 0 
        ? `↓ ${Math.abs(roundedDiff)}% decrease` 
        : `→ No change`
    };
  };

  // Custom tooltips
  const ScoreTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-3 rounded-lg shadow-md transition-colors duration-200">
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400">{payload[0].payload.date}</p>
          <p className="text-xs font-bold text-gray-800 dark:text-slate-200 mt-0.5">
            Patient: {payload[0].payload.patientName}
          </p>
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">
            Score: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  const DonutTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-3 rounded-lg shadow-md transition-colors duration-200">
          <p className="text-xs font-bold text-gray-800 dark:text-slate-200">
            {payload[0].name}
          </p>
          <p className="text-sm font-black text-blue-600 dark:text-blue-400 mt-1">
            Count: {payload[0].value} dimensions
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-8">
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-gray-200/80 dark:bg-slate-850 rounded-md w-32 animate-pulse" />
          <div className="h-8 bg-gray-200/80 dark:bg-slate-850 rounded-lg w-64 animate-pulse mt-1" />
          <div className="h-4 bg-gray-200/80 dark:bg-slate-850 rounded-md w-96 animate-pulse mt-1" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[380px] bg-gray-200/80 dark:bg-slate-850 rounded-xl animate-pulse" />
          <div className="h-[380px] bg-gray-200/80 dark:bg-slate-850 rounded-xl animate-pulse" />
        </div>
        <div className="h-[400px] bg-gray-200/80 dark:bg-slate-850 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return <RetryButton onRetry={fetchHistoryData} message={error} />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-150 dark:border-slate-800/80">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
            <span>Workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-600 dark:text-blue-455">Assessment history</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight mt-1">
            Assessment history
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Track progress across each patient's care journey.
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-gray-550 dark:text-slate-400">Filter Range:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="p-2 border border-gray-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
          </select>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Distribution Chart */}
        <Card className="flex flex-col h-[380px] justify-between transition-colors duration-200">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Score distribution</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">Recent completed assessments</p>
          </div>
          
          <div className="flex-1 w-full h-[260px] flex items-center justify-center">
            {scoreDistributionData.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium w-full h-full flex items-center justify-center bg-gray-50/50 dark:bg-slate-900/20 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">No completed assessments in this period.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistributionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-slate-800/40" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip content={<ScoreTooltip />} />
                  <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Profile Overview (Donut Chart) */}
        <Card className="flex flex-col h-[380px] justify-between transition-colors duration-200">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Profile overview</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">Present vs. growing skills</p>
          </div>

          <div className="flex-1 w-full h-[260px] flex flex-col md:flex-row items-center justify-center gap-6">
            {skillsProfileData.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium w-full h-full flex items-center justify-center bg-gray-50/50 dark:bg-slate-900/20 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">No behavioral/skill measurements available in this period.</p>
            ) : (
              <>
                <div className="w-[180px] h-[180px] flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={skillsProfileData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {skillsProfileData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<DonutTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex flex-col gap-3">
                  {skillsProfileData.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-md mt-0.5 flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="text-xs font-bold text-gray-800 dark:text-slate-200 leading-tight">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium mt-0.5">
                          {item.value} measurements recorded
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Completed Assessments Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Completed assessments</h2>

        {completedAssessments.length === 0 ? (
          <Card className="text-center py-16 px-4">
            <ClipboardCheck className="w-10 h-10 text-gray-400 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-800 dark:text-slate-200">Your completed assessments will appear here.</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Start by selecting a patient and conducting an assessment.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/assessment')}
              className="mt-4 text-xs"
            >
              Start New Assessment
            </Button>
          </Card>
        ) : (
          <Card className="!p-0 overflow-hidden border border-gray-200 dark:border-slate-800/80 transition-colors duration-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
                <thead className="bg-gray-50/50 dark:bg-slate-900/40">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                      Overall Score
                    </th>
                    <th scope="col" className="px-6 py-4 scope text-left text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                      Skills Performance
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-slate-800/80 bg-white dark:bg-slate-900/10">
                  {completedAssessments.map((ass) => {
                    const patientName = ass.patient?.fullName || 'Patient';
                    const initials = patientName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    const dateString = new Date(ass.assessmentDate || ass.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });

                    const reportId = assessmentReportMap[ass._id];
                    const currentScore = Math.round(ass.overallPercentage || (ass.overallScore ? (ass.overallScore > 100 ? (ass.overallScore / 5) : ass.overallScore) : 0));

                    return (
                      <tr 
                        key={ass._id} 
                        onClick={() => handleViewReport(ass._id)}
                        className="hover:bg-gray-50/40 dark:hover:bg-slate-900/30 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 shadow-2xs">
                              {initials}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-slate-200 leading-tight">
                                {patientName}
                              </p>
                              <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium mt-0.5">
                                ID: {ass.patient?.patientId || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                            <span>{dateString}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900 dark:text-slate-200">
                                {currentScore}%
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-900/50">
                                Completed
                              </span>
                            </div>
                            {(() => {
                              const trend = getAssessmentTrend(ass);
                              if (!trend) return null;
                              return (
                                <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                                  trend.diff > 0 
                                    ? 'text-emerald-600 dark:text-emerald-400' 
                                    : trend.diff < 0 
                                    ? 'text-rose-600 dark:text-rose-455' 
                                    : 'text-slate-450 dark:text-slate-500'
                                }`}>
                                  {trend.text}
                                </span>
                              );
                            })()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5 max-w-[320px]">
                            {[
                              { label: 'Eye', score: ass.eyeContact },
                              { label: 'Joint', score: ass.jointAttention },
                              { label: 'Rec', score: ass.receptiveLanguage },
                              { label: 'Exp', score: ass.expressiveLanguage },
                              { label: 'Soc', score: ass.socialInteraction }
                            ].map((skill, idx) => (
                              <span
                                key={idx}
                                className={`inline-flex px-1.5 py-0.5 rounded-md text-[9px] font-semibold border ${
                                  skill.score >= 75
                                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                    : 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30 text-blue-700 dark:text-blue-450'
                                }`}
                              >
                                {skill.label}: {skill.score}%
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewReport(ass._id);
                            }}
                            className="text-xs py-1.5 px-3 flex items-center gap-1.5 ml-auto hover:gap-2 transition-all cursor-pointer"
                          >
                            <span>{reportId ? 'View Report' : 'Generate Report'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
