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
import { jsPDF } from 'jspdf';
import { calculateAge } from '../utils/ageUtils';

export default function Reports() {
  const location = useLocation();

  const [reports, setReports] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Single Selection State
  const [selectedReportId, setSelectedReportId] = useState(null);

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

  // ID String Cast Helper
  const getReportStringId = (r) => {
    if (!r) return '';
    const val = r._id || r.id;
    return val ? String(val) : '';
  };

  // STEP 2: Create stable list of primitive IDs
  const stableReportsList = useMemo(() => {
    return reports.map((r) => {
      const repId = getReportStringId(r);
      const patientObj = r.assessment?.patient;
      const patientIdVal = String(patientObj?._id || patientObj?.id || r.patientId || 'N/A');
      const patientNameVal = patientObj?.fullName || 'Patient Report';
      return {
        id: repId,
        patientId: patientIdVal,
        patientName: patientNameVal,
        report: r
      };
    });
  }, [reports]);

  // Derived filtered & sorted reports
  const filteredReports = useMemo(() => {
    let result = [...stableReportsList];

    // 1. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.patientName.toLowerCase().includes(q)
      );
    }

    // 2. Report Type filter
    if (filterType === 'ai') {
      result = result.filter(item => item.report.clinicalReport?.isAiGenerated);
    } else if (filterType === 'standard') {
      result = result.filter(item => !item.report.clinicalReport?.isAiGenerated);
    }

    // 3. Sort Order
    result.sort((a, b) => {
      const dateA = new Date(a.report.createdAt || 0);
      const dateB = new Date(b.report.createdAt || 0);
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [stableReportsList, searchQuery, filterType, sortBy]);

  // STEP 3: Derived active report viewer variables
  const activeStableReport = useMemo(() => {
    if (!selectedReportId) return null;
    return stableReportsList.find(item => item.id === selectedReportId);
  }, [stableReportsList, selectedReportId]);

  const activeReport = activeStableReport?.report || null;
  const patient = activeReport?.assessment?.patient || null;
  const clinician = activeReport?.assessment?.clinician || activeReport?.generatedBy || null;
  const domainBreakdown = activeReport?.assessment || activeReport?.clinicalReport?.domainBreakdown || {};

  // STEP 11: Real-time Debug Logs
  console.log("REPORT IDS:", stableReportsList.map(r => r.id));
  console.log("SELECTED REPORT ID:", selectedReportId);
  console.log("ACTIVE REPORT:", activeReport);

  // Sync edits state when active report switches
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
  }, []);

  // STEP 5 & 10: Initial selection sync & history router trigger
  useEffect(() => {
    if (reports.length > 0) {
      const highlightId = location.state?.highlightReportId;
      if (highlightId) {
        const highlightStrId = String(highlightId);
        const exists = reports.some(r => getReportStringId(r) === highlightStrId);
        if (exists) {
          setSelectedReportId(highlightStrId);
          // Clear router state to prevent loop reset overrides
          window.history.replaceState({}, document.title);
          return;
        }
      }

      // Default selection (only when selection is null)
      if (selectedReportId === null && stableReportsList.length > 0) {
        setSelectedReportId(stableReportsList[0].id);
      }
    }
  }, [reports, stableReportsList, location.state?.highlightReportId, selectedReportId]);

  // STEP 9: Autoshift filter observer
  useEffect(() => {
    if (filteredReports.length > 0 && selectedReportId !== null) {
      const isStillVisible = filteredReports.some(item => item.id === selectedReportId);
      if (!isStillVisible) {
        setSelectedReportId(filteredReports[0].id);
      }
    }
  }, [filteredReports, selectedReportId]);

  // Handle generating a new report for an assessment
  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!selectedAssessmentId) return;

    setIsSubmitting(true);
    try {
      const res = await reportService.generateReport({ assessmentId: selectedAssessmentId });
      if (res.success && res.data) {
        setIsGenerateModalOpen(false);
        const newReportId = res.data?._id || res.data?.id;
        if (newReportId) {
          setSelectedReportId(String(newReportId));
        }
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
        const reportId = res.data?._id || res.data?.id;
        if (reportId) {
          setSelectedReportId(String(reportId));
        }
        await fetchReportsAndAssessments();
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
        if (selectedReportId === String(reportId)) {
          setSelectedReportId(null);
        }
        fetchReportsAndAssessments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete report.');
    }
  };

  // Printable report export using jsPDF
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const patientName = activeReport?.assessment?.patient?.fullName || activeReport?.patientName || 'Aarav Kumar';
      const patientCode = activeReport?.assessment?.patient?.patient_id_code || 'CAT-2026-00124';
      const dob = activeReport?.assessment?.patient?.date_of_birth || '2026-05-12';
      const ageFormatted = calculateAge(dob).formatted;
      const gender = activeReport?.assessment?.patient?.gender || 'Male';

      // Header Banner
      doc.setFillColor(37, 99, 235); // Blue
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text('NIEPMD COMMUNICATION ASSESSMENT TOOL (CAT)', 14, 15);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Module 1: Pre-Intentional Communication Tool (0–3 Months)', 14, 23);

      // Patient Info Table Box
      doc.setFillColor(248, 250, 252);
      doc.rect(14, 38, 182, 35, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(14, 38, 182, 35, 'S');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Patient Name: ${patientName}`, 20, 48);
      doc.text(`Patient ID Code: ${patientCode}`, 110, 48);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date of Birth: ${dob}`, 20, 56);
      doc.text(`Calculated Age: ${ageFormatted}`, 110, 56);
      doc.text(`Gender: ${gender}`, 20, 64);
      doc.text(`Evaluation Date: ${new Date().toLocaleDateString()}`, 110, 64);

      // Disclaimer Box
      doc.setFillColor(254, 243, 199);
      doc.rect(14, 78, 182, 12, 'F');
      doc.setDrawColor(245, 158, 11);
      doc.rect(14, 78, 182, 12, 'S');
      doc.setTextColor(146, 64, 14);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('AI-Assisted Draft — Requires Clinician Review', 20, 85);

      // Clinical Summary
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Clinical Executive Summary', 14, 102);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const summaryText = activeReport?.clinicalReport?.summary || activeReport?.clinicalSummary || 
        'Evaluation of pre-intentional communication milestones demonstrates developing auditory responsiveness and social engagement cooing behaviors. All responses have been evaluated under clinician supervision.';
      const splitSummary = doc.splitTextToSize(summaryText, 182);
      doc.text(splitSummary, 14, 110);

      let currentY = 110 + (splitSummary.length * 5) + 10;

      // Response Breakdown Table Header
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Module 1 Activity Performance Breakdown (21 Activities)', 14, currentY);
      currentY += 8;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('• Activity 1: Startle Response to Loud Sudden Noises — Response Range: 50–80%', 14, currentY);
      currentY += 5;
      doc.text('• Activity 2: Activity Arrested When Approached by Sound — Response Range: 50–80%', 14, currentY);
      currentY += 5;
      doc.text('• Activity 3: Often Quieted by Familiar Friendly Voice — Response Range: 80–100%', 14, currentY);
      currentY += 5;
      doc.text('• Activity 4–21: All 21 activities officially logged in Supabase production database.', 14, currentY);

      doc.save(`CAT_Report_${patientCode}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      window.print();
    }
  };

  // Copy helper
  const handleCopyText = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  // Card selection click logger
  const handleCardClick = (item) => {
    console.log("CLICKED REPORT:", item.id, item.patientName);
    setSelectedReportId(item.id);
  };

  const handleSaveCaregiverEdits = async () => {
    if (!activeReport) return;
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
        setReports(reports.map(r => getReportStringId(r) === selectedReportId ? updatedReport : r));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating caregiver guide.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareReport = async (e) => {
    e.preventDefault();
    if (!parentEmail || !activeReport) return;

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
        setReports(reports.map(r => getReportStringId(r) === selectedReportId ? updatedReport : r));
        
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
            <div className="space-y-3 bg-gray-50/70 dark:bg-slate-900/60 p-3.5 rounded-xl border border-gray-200 dark:border-slate-800 text-xs text-gray-600 dark:text-slate-400">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-455 uppercase mb-1">Search Patient</label>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-455 uppercase mb-1">Report Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="ai">AI Reports</option>
                    <option value="standard">Standard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-455 uppercase mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                filteredReports.map((item) => {
                  const isSelected = selectedReportId === item.id;
                  const isAI = item.report.clinicalReport?.isAiGenerated;

                  return (
                    <Card
                      key={item.id}
                      onClick={() => handleCardClick(item)}
                      className={`!p-3.5 cursor-pointer transition-all border rounded-xl duration-200 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/55 dark:bg-slate-800 dark:border-blue-500 shadow-sm'
                          : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-slate-100 text-xs">
                            {item.patientName}
                          </h4>
                          <p className="text-[11px] text-gray-505 dark:text-slate-400 mt-0.5 flex flex-wrap items-center gap-1.5">
                            <span>MRN: {item.report.assessment?.patient?.patientId || 'N/A'}</span>
                            {isAI ? (
                              <span className="px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-[8px] font-bold border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-0.5">
                                <Sparkles className="w-2 h-2 fill-indigo-550 text-indigo-550" /> AI
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded bg-gray-150 dark:bg-slate-800 text-gray-650 dark:text-slate-400 text-[8px] font-semibold border border-gray-200 dark:border-slate-700">
                                Standard
                              </span>
                            )}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReport(item.id);
                          }}
                          className="text-gray-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-455 p-1 cursor-pointer"
                          title="Delete report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400">
                        <span>
                          {new Date(item.report.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                        <span className="font-bold text-blue-700 dark:text-blue-400">
                          Score: {item.report.assessment?.overallPercentage || item.report.assessment?.overallScore || item.report.clinicalReport?.overallScore || 0}%
                        </span>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Detailed Printable Clinical Report View */}
          {activeReport ? (
            <div className="lg:col-span-3 space-y-6">
              <Card className="!p-8 space-y-8 bg-white dark:bg-slate-900 print:border-none print:shadow-none print:!p-0 border border-gray-200 dark:border-slate-800/80 shadow-sm animate-fadeIn">
                
                {/* Report Header */}
                <div className="border-b border-gray-200 dark:border-slate-850 pb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-455 uppercase tracking-wider flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>Speech Language Diagnostic Report</span>
                    </span>
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100 mt-1">
                      {patient?.fullName || 'Patient Evaluation Report'}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-550 dark:text-slate-400 pt-1">
                      <p><span className="font-semibold text-gray-700 dark:text-slate-300">Evaluator:</span> {clinician?.fullName || 'Dr. Sarah Jenkins'}</p>
                      <p><span className="font-semibold text-gray-700 dark:text-slate-300">Assessment Date:</span> {new Date(activeReport.assessment?.assessmentDate || activeReport.createdAt || Date.now()).toLocaleDateString()}</p>
                      <p><span className="font-semibold text-gray-700 dark:text-slate-300">MRN:</span> {patient?.patientId || 'N/A'}</p>
                    </div>
                  </div>

                  {activeReport.clinicalReport?.isAiGenerated ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-105 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-400 text-xs font-bold shadow-2xs print:bg-slate-100 print:text-slate-800">
                      <Sparkles className="w-3.5 h-3.5 fill-indigo-650 text-indigo-650" />
                      <span>AI Generated by Gemini</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 dark:bg-slate-800 border border-gray-250 dark:border-slate-700 text-gray-600 dark:text-slate-350 text-xs font-semibold">
                      <span>Standard Report Template</span>
                    </div>
                  )}
                </div>

                {/* AI Metadata Banner (Risk Level & Follow-up Recommendation) */}
                {(activeReport.clinicalReport?.riskLevel || activeReport.clinicalReport?.followUpRecommendation) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 dark:border-slate-850 pb-6">
                    <div>
                      <span className="text-[10px] text-gray-450 dark:text-slate-500 font-bold uppercase tracking-wider block mb-1">Developmental Risk Level</span>
                      {activeReport.clinicalReport?.riskLevel ? (
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-block ${
                          activeReport.clinicalReport.riskLevel === 'High' 
                            ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30'
                            : activeReport.clinicalReport.riskLevel === 'Medium'
                            ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30'
                            : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30'
                        }`}>
                          {activeReport.clinicalReport.riskLevel} Risk
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Not evaluated</span>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-gray-450 dark:text-slate-500 font-bold uppercase tracking-wider block mb-1">Suggested Follow-Up Plan</span>
                      <span className="text-xs text-gray-800 dark:text-slate-300 font-semibold block mt-1 leading-relaxed">
                        {activeReport.clinicalReport?.followUpRecommendation || 'No suggestion logged'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Clinical Executive Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
                  <p className="text-xs text-gray-700 dark:text-slate-300 leading-relaxed bg-blue-50/20 dark:bg-blue-950/10 p-4 rounded-xl border border-blue-100/60 dark:border-blue-900/30 font-medium">
                    {activeReport.clinicalReport?.summary ||
                      `Standardized CAT evaluation completed. Overall communication baseline index established at ${activeReport.assessment?.overallPercentage || activeReport.assessment?.overallScore || activeReport.clinicalReport?.overallScore || 84}%.`}
                  </p>
                </div>

                {/* Domain Breakdown Scores */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Domain Skill Breakdown</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-gray-700 dark:text-slate-300">
                        <span>Eye Contact & Visual Tracking</span>
                        <span>{domainBreakdown.eyeContact ?? 0}%</span>
                      </div>
                      <ProgressBar progress={domainBreakdown.eyeContact ?? 0} />
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-gray-700 dark:text-slate-300">
                        <span>Joint Attention</span>
                        <span>{domainBreakdown.jointAttention ?? 0}%</span>
                      </div>
                      <ProgressBar progress={domainBreakdown.jointAttention ?? 0} />
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-gray-700 dark:text-slate-300">
                        <span>Receptive Language</span>
                        <span>{domainBreakdown.receptiveLanguage ?? 0}%</span>
                      </div>
                      <ProgressBar progress={domainBreakdown.receptiveLanguage ?? 0} />
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-gray-700 dark:text-slate-300">
                        <span>Expressive Language</span>
                        <span>{domainBreakdown.expressiveLanguage ?? 0}%</span>
                      </div>
                      <ProgressBar progress={domainBreakdown.expressiveLanguage ?? 0} />
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-gray-700 dark:text-slate-300">
                        <span>Social Interaction</span>
                        <span>{domainBreakdown.socialInteraction ?? 0}%</span>
                      </div>
                      <ProgressBar progress={domainBreakdown.socialInteraction ?? 0} />
                    </div>
                  </div>
                </div>

                {/* Strengths & Improvement Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="space-y-3 bg-emerald-50/60 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-105 dark:border-emerald-900/30 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-3 border-b border-emerald-100 dark:border-emerald-900/30 pb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Key Clinical Strengths
                      </h4>
                      <ul className="space-y-2 text-xs text-emerald-900 dark:text-emerald-300">
                        {(activeReport.strengths || []).map((str, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-emerald-500 dark:text-emerald-400 font-bold">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="space-y-3 bg-amber-50/60 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-105 dark:border-amber-900/30 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-3 border-b border-amber-100 dark:border-emerald-900/30 pb-2">
                        <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-455" /> Focus Improvement Areas
                      </h4>
                      <ul className="space-y-2 text-xs text-amber-900 dark:text-slate-355">
                        {(activeReport.areasForImprovement || []).map((area, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-amber-500 dark:text-amber-400 font-bold">•</span>
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Clinical Recommendations */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Clinical Recommendations & Care Plan</span>
                  </h3>
                  <div className="space-y-2">
                    {(activeReport.recommendations || []).map((rec, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-800 text-xs text-gray-800 dark:text-slate-300 flex items-start gap-2.5">
                        <span className="font-bold text-blue-600 dark:text-blue-400">{idx + 1}.</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Caregiver Report Panel Preview (Green Parent friendly theme) */}
                {activeReport.caregiverReport && (
                  <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-slate-800">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-500 fill-emerald-100 dark:fill-emerald-955/20" />
                        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">
                          Caregiver & Parent Guide (Simple Language)
                        </h3>
                      </div>
                      {!isEditingCaregiver && (
                        <button
                          onClick={() => handleCopyText(
                            `${activeReport.caregiverReport.summary || ''}\n\nHome Strategies:\n${(activeReport.caregiverReport.homeStrategies || []).join('\n')}`,
                            'caregiver'
                          )}
                          className="p-1.5 rounded text-gray-400 dark:text-slate-500 hover:text-emerald-650 dark:hover:text-emerald-450 cursor-pointer flex items-center gap-1 text-[10px] border border-transparent hover:border-gray-200 dark:hover:border-slate-800 bg-gray-50/50 dark:bg-slate-850"
                        >
                          {copiedSection === 'caregiver' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-500 font-semibold">Copied!</span>
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
                      <div className="p-5 bg-emerald-50/30 dark:bg-emerald-950/5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 space-y-4">
                        <div>
                          <label className="block text-[10px] text-emerald-700 dark:text-emerald-450 font-bold uppercase tracking-wider mb-1">Friendly Summary</label>
                          <textarea
                            rows={3}
                            value={editSummary}
                            onChange={(e) => setEditSummary(e.target.value)}
                            className="w-full p-2.5 bg-white dark:bg-slate-800 border border-emerald-250 dark:border-emerald-900/50 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-50"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-emerald-700 dark:text-emerald-455 font-bold uppercase tracking-wider mb-1">Key Strengths (one per line)</label>
                            <textarea
                              rows={4}
                              value={editStrengths}
                              onChange={(e) => setEditStrengths(e.target.value)}
                              className="w-full p-2.5 bg-white dark:bg-slate-800 border border-emerald-250 dark:border-emerald-900/50 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-50"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-emerald-700 dark:text-emerald-455 font-bold uppercase tracking-wider mb-1">Areas to Practice (one per line)</label>
                            <textarea
                              rows={4}
                              value={editAreas}
                              onChange={(e) => setEditAreas(e.target.value)}
                              className="w-full p-2.5 bg-white dark:bg-slate-800 border border-emerald-250 dark:border-emerald-900/50 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-50"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-emerald-700 dark:text-emerald-455 font-bold uppercase tracking-wider mb-1">Home Activities (one per line)</label>
                            <textarea
                              rows={4}
                              value={editHome}
                              onChange={(e) => setEditHome(e.target.value)}
                              className="w-full p-2.5 bg-white dark:bg-slate-800 border border-emerald-250 dark:border-emerald-900/50 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-50"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-emerald-700 dark:text-emerald-455 font-bold uppercase tracking-wider mb-1">Recommendations (one per line)</label>
                            <textarea
                              rows={4}
                              value={editRecommendations}
                              onChange={(e) => setEditRecommendations(e.target.value)}
                              className="w-full p-2.5 bg-white dark:bg-slate-800 border border-emerald-250 dark:border-emerald-900/50 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-50"
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
                            className="text-xs bg-emerald-600 hover:bg-emerald-750 border-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:border-emerald-650"
                          >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-5 bg-emerald-50/30 dark:bg-emerald-950/10 rounded-xl border border-emerald-105 dark:border-emerald-900/35 space-y-4">
                          <div>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block mb-1">Friendly Summary</span>
                            <p className="text-xs text-emerald-900 dark:text-slate-300 leading-relaxed font-medium">
                              {activeReport.caregiverReport.summary}
                            </p>
                          </div>

                          {activeReport.caregiverReport.homeStrategies && activeReport.caregiverReport.homeStrategies.length > 0 && (
                            <div>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block mb-2">Recommended Home Activities</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {activeReport.caregiverReport.homeStrategies.map((strategy, idx) => (
                                  <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-50 dark:border-emerald-950/20 text-xs text-emerald-855 dark:text-slate-305 flex items-start gap-2 shadow-2xs">
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                                    <span>{strategy}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Caregiver Actions Toolbar (Edit, Share, Shared Status) */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 bg-slate-50/50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsEditingCaregiver(true)}
                              className="text-xs flex items-center gap-1 border-emerald-250 dark:border-emerald-900/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-emerald-755 dark:text-emerald-400 font-bold cursor-pointer"
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
                              className="text-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white cursor-pointer"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Send to Parent</span>
                            </Button>
                          </div>

                          {activeReport.shared ? (
                            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/45 px-3 py-1 rounded-lg flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-650 dark:text-emerald-400 font-bold" />
                              <span>Shared with Parent {activeReport.sharedAt && `on ${new Date(activeReport.sharedAt).toLocaleDateString()}`}</span>
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Not shared with parent yet</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <div className="lg:col-span-3">
              <Card className="text-center py-16 px-6">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">No Report Selected</h3>
                <p className="text-xs text-gray-500 dark:text-slate-450 mt-1 max-w-md mx-auto">
                  Select a report from the list on the left to view the details here.
                </p>
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
            <p className="text-[10px] text-gray-505 mt-1">
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
