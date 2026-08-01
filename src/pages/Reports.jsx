import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FileText,
  Download,
  Calendar,
  User,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Award,
  Plus,
  Trash2,
  Loader2,
  Sparkles,
  Copy,
  Check,
  Heart,
  Printer,
  Share2,
  Edit2
} from 'lucide-react';
import Header from '../components/Header/Header';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import SkeletonLoader from '../components/Loader/SkeletonLoader';
import RetryButton from '../components/Common/RetryButton';
import Modal from '../components/Modal/Modal';
import { reportService } from '../services/reportService';
import { assessmentService } from '../services/assessmentService';

export default function Reports() {
  const location = useLocation();

  const [reports, setReports] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeReport, setActiveReport] = useState(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null);

  // Caregiver Edit States
  const [isEditingCaregiver, setIsEditingCaregiver] = useState(false);
  const [editSummary, setEditSummary] = useState('');
  const [editStrengths, setEditStrengths] = useState('');
  const [editAreas, setEditAreas] = useState('');
  const [editHome, setEditHome] = useState('');
  const [editRecommendations, setEditRecommendations] = useState('');

  // Share States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [parentEmail, setParentEmail] = useState('');
  const [shareError, setShareError] = useState(null);
  const [shareSuccess, setShareSuccess] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (activeReport) {
      setEditSummary(activeReport.caregiverReport?.summary || '');
      setEditStrengths((activeReport.strengths || []).join('\n'));
      setEditAreas((activeReport.areasForImprovement || []).join('\n'));
      setEditHome((activeReport.caregiverReport?.homeStrategies || []).join('\n'));
      setEditRecommendations((activeReport.recommendations || []).join('\n'));
      setIsEditingCaregiver(false);
    }
  }, [activeReport]);

  // Search, Filter & Sort States
  const [searchQuery, setSearchQuery] = useState(() => {
    return sessionStorage.getItem('reports_searchQuery') || '';
  });
  const [filterType, setFilterType] = useState(() => {
    return sessionStorage.getItem('reports_filterType') || 'all';
  });
  const [sortBy, setSortBy] = useState(() => {
    return sessionStorage.getItem('reports_sortBy') || 'newest';
  });

  useEffect(() => {
    sessionStorage.setItem('reports_searchQuery', searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    sessionStorage.setItem('reports_filterType', filterType);
  }, [filterType]);

  useEffect(() => {
    sessionStorage.setItem('reports_sortBy', sortBy);
  }, [sortBy]);

  const fetchReportsAndAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reportsRes, assessmentsRes] = await Promise.all([
        reportService.getReports(),
        assessmentService.getAssessmentsByPatient('all').catch(() => ({ success: true, data: { assessments: [] } })),
      ]);

      if (reportsRes.success && reportsRes.data) {
        setReports(reportsRes.data);
        
        // Highlight a specific report if redirected from assessment save success
        const highlightId = location.state?.highlightReportId;
        if (highlightId) {
          const found = reportsRes.data.find(r => (r._id === highlightId || r.id === highlightId));
          if (found) {
            setActiveReport(found);
          } else if (reportsRes.data.length > 0) {
            setActiveReport(reportsRes.data[0]);
          }
        } else if (reportsRes.data.length > 0) {
          setActiveReport(reportsRes.data[0]);
        }
      }

      if (assessmentsRes.success && assessmentsRes.data?.assessments) {
        setAssessments(assessmentsRes.data.assessments);
        if (assessmentsRes.data.assessments.length > 0) {
          setSelectedAssessmentId(assessmentsRes.data.assessments[0]._id);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load report data from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsAndAssessments();
  }, [location.state?.highlightReportId]);

  // Derived filtered & sorted reports
  const filteredReports = useMemo(() => {
    let result = [...reports];

    // 1. Search Query (patient name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.assessment?.patient?.fullName?.toLowerCase().includes(q)
      );
    }

    // 2. Filter Type (AI vs Standard)
    if (filterType === 'ai') {
      result = result.filter(r => r.clinicalReport?.isAiGenerated);
    } else if (filterType === 'standard') {
      result = result.filter(r => !r.clinicalReport?.isAiGenerated);
    }

    // 3. Sort By
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [reports, searchQuery, filterType, sortBy]);

  // Handle generating a new report for an assessment
  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!selectedAssessmentId) return;

    setIsSubmitting(true);
    try {
      const res = await reportService.generateReport({ assessmentId: selectedAssessmentId });
      if (res.success && res.data) {
        setIsGenerateModalOpen(false);
        await fetchReportsAndAssessments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error generating report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle generating an AI report using Gemini
  const handleGenerateAIReport = async () => {
    if (!selectedAssessmentId) return;

    setIsSubmitting(true);
    try {
      const res = await reportService.generateAIReport({ assessmentId: selectedAssessmentId });
      if (res.success && res.data) {
        setIsGenerateModalOpen(false);
        await fetchReportsAndAssessments();
        // Highlight the newly created AI report
        const reportId = res.data?._id || res.data?.id;
        const found = reports.find(r => r._id === reportId || r.id === reportId);
        setActiveReport(found || res.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error generating AI report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a report
  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report record?')) return;

    try {
      const res = await reportService.deleteReport(reportId);
      if (res.success) {
        if (activeReport && (activeReport._id === reportId || activeReport.id === reportId)) {
          setActiveReport(null);
        }
        fetchReportsAndAssessments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete report.');
    }
  };

  // Printable report export
  const handleExportPDF = () => {
    window.print();
  };

  // Copy helper
  const handleCopyText = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleSaveCaregiverEdits = async () => {
    setIsSubmitting(true);
    try {
      const updatedData = {
        caregiverReport: {
          ...activeReport.caregiverReport,
          summary: editSummary,
          homeStrategies: editHome.split('\n').map(s => s.trim()).filter(Boolean),
        },
        strengths: editStrengths.split('\n').map(s => s.trim()).filter(Boolean),
        areasForImprovement: editAreas.split('\n').map(s => s.trim()).filter(Boolean),
        recommendations: editRecommendations.split('\n').map(s => s.trim()).filter(Boolean),
      };

      const res = await reportService.updateReport(activeReport._id || activeReport.id, updatedData);
      if (res.success && res.data) {
        setIsEditingCaregiver(false);
        const updatedReport = {
          ...activeReport,
          ...res.data,
          assessment: activeReport.assessment,
          generatedBy: activeReport.generatedBy,
        };
        setActiveReport(updatedReport);
        setReports(reports.map(r => (r._id === activeReport._id || r.id === activeReport.id) ? updatedReport : r));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating caregiver guide.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareReport = async (e) => {
    e.preventDefault();
    if (!parentEmail) return;

    setIsSharing(true);
    setShareError(null);
    setShareSuccess(null);

    try {
      const res = await reportService.shareReport(activeReport._id || activeReport.id, parentEmail);
      if (res.success && res.data) {
        setShareSuccess(res.message || 'Report shared successfully!');
        const updatedReport = {
          ...activeReport,
          parentId: res.data.parentId,
          shared: true,
          sharedAt: res.data.sharedAt,
        };
        setActiveReport(updatedReport);
        setReports(reports.map(r => (r._id === activeReport._id || r.id === activeReport.id) ? updatedReport : r));
        
        setTimeout(() => {
          setIsShareModalOpen(false);
          setParentEmail('');
          setShareSuccess(null);
        }, 1500);
      }
    } catch (err) {
      setShareError(err.response?.data?.message || 'Failed to share report. Verify parent email exists.');
    } finally {
      setIsSharing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-12">
        <SkeletonLoader count={1} />
        <SkeletonLoader count={4} />
      </div>
    );
  }

  if (error) {
    return <RetryButton onRetry={fetchReportsAndAssessments} message={error} />;
  }

  const patient = activeReport?.assessment?.patient;
  const clinician = activeReport?.assessment?.clinician || activeReport?.generatedBy;
  const domainBreakdown = activeReport?.clinicalReport?.domainBreakdown || {};

  return (
    <div className="space-y-6 pb-12 font-sans">
      <Header
        title="Assessment Reports"
        subtitle="Clinical diagnostic reports, caregiver guides, and PDF export modules."
      >
        <div className="flex items-center gap-2">
          {assessments.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setIsGenerateModalOpen(true)}
              className="text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Generate New Report</span>
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleExportPDF}
            className="text-xs flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </Button>
        </div>
      </Header>

      {reports.length === 0 ? (
        <Card className="text-center py-16 px-6">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900">No Reports Available</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            No clinical diagnostic reports found in database. Complete an assessment first, then generate a report.
          </p>
          {assessments.length > 0 && (
            <Button
              variant="primary"
              onClick={() => setIsGenerateModalOpen(true)}
              className="mt-4 text-xs"
            >
              Generate First Report
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: List of generated reports */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
              Select Patient Report
            </h3>

            {/* Search & Filter Controls */}
            <div className="space-y-3 bg-gray-50/70 p-3.5 rounded-xl border border-gray-200 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Search Patient</label>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Report Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="ai">AI Reports</option>
                    <option value="standard">Standard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredReports.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400 bg-gray-50/40 rounded-xl border border-dashed border-gray-200">
                  No matching reports found.
                </div>
              ) : (
                filteredReports.map((report) => {
                  const reportPt = report.assessment?.patient;
                  const isSelected = activeReport && (activeReport._id === report._id || activeReport.id === report.id);
                  const isAI = report.clinicalReport?.isAiGenerated;

                  return (
                    <Card
                      key={report._id || report.id}
                      onClick={() => setActiveReport(report)}
                      className={`!p-3.5 cursor-pointer transition-all border ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-gray-900 text-xs">
                            {reportPt?.fullName || 'Patient Report'}
                          </h4>
                          <p className="text-[11px] text-gray-500 mt-0.5 flex flex-wrap items-center gap-1.5">
                            <span>MRN: {reportPt?.patientId || 'N/A'}</span>
                            {isAI ? (
                              <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-600 text-[8px] font-bold border border-indigo-100 flex items-center gap-0.5">
                                <Sparkles className="w-2 h-2 fill-indigo-550 text-indigo-550" /> AI
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded bg-gray-150 text-gray-650 text-[8px] font-semibold border border-gray-200">
                                Standard
                              </span>
                            )}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReport(report._id || report.id);
                          }}
                          className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Delete report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                        <span>
                          {new Date(report.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                        <span className="font-bold text-blue-700">
                          Score: {report.clinicalReport?.overallScore || report.assessment?.overallScore || 0}%
                        </span>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Detailed Printable Clinical Report View */}
          {activeReport && (
            <div className="lg:col-span-3 space-y-6">
              <Card className="!p-8 space-y-8 bg-white print:border-none print:shadow-none print:!p-0 border border-gray-200 shadow-sm">
                
                {/* Report Header */}
                <div className="border-b border-gray-200 pb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>Speech Language Diagnostic Report</span>
                    </span>
                    <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
                      {patient?.fullName || 'Patient Evaluation Report'}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                      <p><span className="font-semibold text-gray-700">Evaluator:</span> {clinician?.fullName || 'Dr. Sarah Jenkins'}</p>
                      <p><span className="font-semibold text-gray-700">Date:</span> {new Date(activeReport.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {activeReport.clinicalReport?.isAiGenerated ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-700 text-xs font-bold shadow-2xs print:bg-slate-100 print:text-slate-800">
                      <Sparkles className="w-3.5 h-3.5 fill-indigo-650 text-indigo-650" />
                      <span>AI Generated by Gemini</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-250 text-gray-600 text-xs font-semibold">
                      <span>Standard Report Template</span>
                    </div>
                  )}
                </div>

                {/* AI Metadata Banner (Risk Level & Follow-up Recommendation) */}
                {(activeReport.clinicalReport?.riskLevel || activeReport.clinicalReport?.followUpRecommendation) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-6">
                    <div>
                      <span className="text-[10px] text-gray-450 font-bold uppercase tracking-wider block mb-1">Developmental Risk Level</span>
                      {activeReport.clinicalReport?.riskLevel ? (
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-block ${
                          activeReport.clinicalReport.riskLevel === 'High' 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : activeReport.clinicalReport.riskLevel === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {activeReport.clinicalReport.riskLevel} Risk
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 font-medium">Not evaluated</span>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-gray-450 font-bold uppercase tracking-wider block mb-1">Suggested Follow-Up Plan</span>
                      <span className="text-xs text-gray-800 font-semibold block mt-1 leading-relaxed">
                        {activeReport.clinicalReport?.followUpRecommendation || 'No suggestion logged'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Clinical Executive Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Clinical Executive Summary</span>
                    </h3>
                    <button
                      onClick={() => handleCopyText(activeReport.clinicalReport?.summary || '', 'summary')}
                      className="p-1.5 rounded text-gray-400 hover:text-blue-600 cursor-pointer flex items-center gap-1 text-[10px] border border-transparent hover:border-gray-200 bg-gray-50/50"
                    >
                      {copiedSection === 'summary' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed bg-blue-50/20 p-4 rounded-xl border border-blue-100/60 font-medium">
                    {activeReport.clinicalReport?.summary ||
                      `Standardized CAT evaluation completed. Overall communication baseline index established at ${activeReport.clinicalReport?.overallScore || 84}%.`}
                  </p>
                </div>

                {/* Domain Breakdown Scores */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>Domain Skill Breakdown</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-gray-700">
                        <span>Eye Contact & Visual Tracking</span>
                        <span>{domainBreakdown.eyeContact || 80}%</span>
                      </div>
                      <ProgressBar progress={domainBreakdown.eyeContact || 80} />
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-gray-700">
                        <span>Joint Attention</span>
                        <span>{domainBreakdown.jointAttention || 85}%</span>
                      </div>
                      <ProgressBar progress={domainBreakdown.jointAttention || 85} />
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-gray-700">
                        <span>Receptive Language</span>
                        <span>{domainBreakdown.receptiveLanguage || 90}%</span>
                      </div>
                      <ProgressBar progress={domainBreakdown.receptiveLanguage || 90} />
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-gray-700">
                        <span>Expressive Language</span>
                        <span>{domainBreakdown.expressiveLanguage || 75}%</span>
                      </div>
                      <ProgressBar progress={domainBreakdown.expressiveLanguage || 75} />
                    </div>
                  </div>
                </div>

                {/* Strengths & Improvement Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="space-y-3 bg-emerald-50/60 p-4 rounded-xl border border-emerald-105 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-3 border-b border-emerald-100 pb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Clinical Strengths
                      </h4>
                      <ul className="space-y-2 text-xs text-emerald-900">
                        {(activeReport.strengths || []).map((str, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="space-y-3 bg-amber-50/60 p-4 rounded-xl border border-amber-100 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 mb-3 border-b border-amber-100 pb-2">
                        <TrendingUp className="w-4 h-4 text-amber-600" /> Focus Improvement Areas
                      </h4>
                      <ul className="space-y-2 text-xs text-amber-900">
                        {(activeReport.areasForImprovement || []).map((area, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Clinical Recommendations */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Clinical Recommendations & Care Plan</span>
                  </h3>
                  <div className="space-y-2">
                    {(activeReport.recommendations || []).map((rec, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-800 flex items-start gap-2.5">
                        <span className="font-bold text-blue-600">{idx + 1}.</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Caregiver Report Panel Preview (Green Parent friendly theme) */}
                {activeReport.caregiverReport && (
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        <h3 className="text-sm font-bold text-gray-900">
                          Caregiver & Parent Guide (Simple Language)
                        </h3>
                      </div>
                      {!isEditingCaregiver && (
                        <button
                          onClick={() => handleCopyText(
                            `${activeReport.caregiverReport.summary || ''}\n\nHome Strategies:\n${(activeReport.caregiverReport.homeStrategies || []).join('\n')}`,
                            'caregiver'
                          )}
                          className="p-1.5 rounded text-gray-400 hover:text-emerald-600 cursor-pointer flex items-center gap-1 text-[10px] border border-transparent hover:border-gray-200 bg-gray-50/50"
                        >
                          {copiedSection === 'caregiver' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-semibold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Caregiver Guide</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    
                    {isEditingCaregiver ? (
                      <div className="p-5 bg-emerald-50/30 rounded-xl border border-emerald-100 space-y-4">
                        <div>
                          <label className="block text-[10px] text-emerald-700 font-bold uppercase tracking-wider mb-1">Friendly Summary</label>
                          <textarea
                            rows={3}
                            value={editSummary}
                            onChange={(e) => setEditSummary(e.target.value)}
                            className="w-full p-2.5 bg-white border border-emerald-250 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-50"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-emerald-700 font-bold uppercase tracking-wider mb-1">Key Strengths (one per line)</label>
                            <textarea
                              rows={4}
                              value={editStrengths}
                              onChange={(e) => setEditStrengths(e.target.value)}
                              className="w-full p-2.5 bg-white border border-emerald-250 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-50"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-emerald-700 font-bold uppercase tracking-wider mb-1">Areas to Practice (one per line)</label>
                            <textarea
                              rows={4}
                              value={editAreas}
                              onChange={(e) => setEditAreas(e.target.value)}
                              className="w-full p-2.5 bg-white border border-emerald-250 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-50"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-emerald-700 font-bold uppercase tracking-wider mb-1">Home Activities (one per line)</label>
                            <textarea
                              rows={4}
                              value={editHome}
                              onChange={(e) => setEditHome(e.target.value)}
                              className="w-full p-2.5 bg-white border border-emerald-250 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-50"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-emerald-700 font-bold uppercase tracking-wider mb-1">Recommendations (one per line)</label>
                            <textarea
                              rows={4}
                              value={editRecommendations}
                              onChange={(e) => setEditRecommendations(e.target.value)}
                              className="w-full p-2.5 bg-white border border-emerald-250 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-50"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsEditingCaregiver(false)}
                            className="text-xs"
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            onClick={handleSaveCaregiverEdits}
                            disabled={isSubmitting}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                          >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-5 bg-emerald-50/30 rounded-xl border border-emerald-105 space-y-4">
                          <div>
                            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block mb-1">Friendly Summary</span>
                            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                              {activeReport.caregiverReport.summary}
                            </p>
                          </div>

                          {activeReport.caregiverReport.homeStrategies && activeReport.caregiverReport.homeStrategies.length > 0 && (
                            <div>
                              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block mb-2">Recommended Home Activities</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {activeReport.caregiverReport.homeStrategies.map((strategy, idx) => (
                                  <div key={idx} className="p-3 bg-white rounded-lg border border-emerald-50 text-xs text-emerald-855 flex items-start gap-2 shadow-2xs">
                                    <span className="font-bold text-emerald-600 mt-0.5">•</span>
                                    <span>{strategy}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Caregiver Actions Toolbar (Edit, Share, Shared Status) */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsEditingCaregiver(true)}
                              className="text-xs flex items-center gap-1 border-emerald-250 hover:bg-emerald-50/50 text-emerald-755 font-bold cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit Caregiver Guide</span>
                            </Button>
                            
                            <Button
                              variant="primary"
                              onClick={() => {
                                setParentEmail('');
                                setShareError(null);
                                setShareSuccess(null);
                                setIsShareModalOpen(true);
                              }}
                              className="text-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white cursor-pointer"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Send to Parent</span>
                            </Button>
                          </div>

                          {activeReport.shared ? (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-650 font-bold" />
                              <span>Shared with Parent {activeReport.sharedAt && `on ${new Date(activeReport.sharedAt).toLocaleDateString()}`}</span>
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-slate-500">Not shared with parent yet</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Generate Report Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Clinical Report"
      >
        <form onSubmit={handleGenerateReport} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Select Completed Assessment *</label>
            <select
              value={selectedAssessmentId}
              onChange={(e) => setSelectedAssessmentId(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {assessments.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.patient?.fullName || 'Patient'} - Score: {a.overallScore || a.overallPercentage || 0}% ({new Date(a.createdAt).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-gray-150 flex flex-wrap justify-between items-center gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsGenerateModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                type="submit" 
                disabled={isSubmitting}
                className="text-xs"
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Generate Manual Report'}
              </Button>
              <Button 
                variant="primary" 
                type="button" 
                onClick={handleGenerateAIReport}
                disabled={isSubmitting}
                className="text-xs bg-indigo-650 hover:bg-indigo-755 text-white flex items-center gap-1 cursor-pointer border border-indigo-650"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
                    <span>Generate AI Report</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Share Report Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Report with Parent"
      >
        <form onSubmit={handleShareReport} className="space-y-4 text-xs font-sans">
          {shareError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-750 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="font-medium">{shareError}</span>
            </div>
          )}

          {shareSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-start gap-2">
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600 font-bold" />
              <span className="font-medium">{shareSuccess}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Parent's Email Address *</label>
            <input
              type="email"
              required
              placeholder="parent@example.com"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Note: This links the report in-app. The parent must have an active CAT account under this email.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-150 flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsShareModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSharing}
              className="text-xs bg-emerald-600 hover:bg-emerald-755 text-white border border-emerald-600"
            >
              {isSharing ? 'Sending...' : 'Send to Parent'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
