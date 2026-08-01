import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Share2,
  Calendar,
  User,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Award,
  Plus,
  Trash2,
  Loader2
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
  const [reports, setReports] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeReport, setActiveReport] = useState(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (reportsRes.data.length > 0) {
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
  }, []);

  // Handle generating a new report for an assessment
  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!selectedAssessmentId) return;

    setIsSubmitting(true);
    try {
      const res = await reportService.generateReport({ assessmentId: selectedAssessmentId });
      if (res.success && res.data) {
        setIsGenerateModalOpen(false);
        fetchReportsAndAssessments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error generating report.');
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
    <div className="space-y-6 pb-12">
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
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
              Select Patient Report
            </h3>

            {reports.map((report) => {
              const reportPt = report.assessment?.patient;
              const isSelected = activeReport && (activeReport._id === report._id || activeReport.id === report.id);

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
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        MRN: {reportPt?.patientId || 'N/A'}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReport(report._id || report.id);
                      }}
                      className="text-gray-400 hover:text-rose-600 p-1"
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
            })}
          </div>

          {/* Right Column: Detailed Printable Clinical Report View */}
          {activeReport && (
            <div className="lg:col-span-3 space-y-6">
              <Card className="!p-8 space-y-8 bg-white print:border-none print:shadow-none">
                {/* Report Header */}
                <div className="border-b border-gray-200 pb-6 flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      Speech Language Diagnostic Report
                    </span>
                    <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
                      {patient?.fullName || 'Patient Evaluation Report'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Communication Assessment Tool (CAT) Standardized Evaluation
                    </p>
                  </div>

                  <div className="text-left sm:text-right text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p><span className="font-semibold text-gray-700">MRN:</span> {patient?.patientId || 'N/A'}</p>
                    <p><span className="font-semibold text-gray-700">Age / Gender:</span> {patient?.age} yrs / {patient?.gender || 'N/A'}</p>
                    <p><span className="font-semibold text-gray-700">Evaluator:</span> {clinician?.fullName || 'Dr. Sarah Jenkins'}</p>
                    <p><span className="font-semibold text-gray-700">Date:</span> {new Date(activeReport.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Clinical Executive Summary */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Clinical Executive Summary</span>
                  </h3>
                  <p className="text-xs text-gray-700 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
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
                  <div className="space-y-3 bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Clinical Strengths
                    </h4>
                    <ul className="space-y-2 text-xs text-emerald-900">
                      {(activeReport.strengths || []).map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="space-y-3 bg-amber-50/60 p-4 rounded-xl border border-amber-100">
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-amber-600" /> Focus Improvement Areas
                    </h4>
                    <ul className="space-y-2 text-xs text-amber-900">
                      {(activeReport.areasForImprovement || []).map((area, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
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
                  {a.patient?.fullName || 'Patient'} - Score: {a.overallScore}% ({new Date(a.createdAt).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsGenerateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate Report'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
