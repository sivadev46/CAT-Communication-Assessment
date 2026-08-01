import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import {
  Heart,
  Calendar,
  PlayCircle,
  BookOpen,
  AlertCircle,
  FileText,
  LogOut,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Video,
  Download,
  Printer,
  ChevronRight,
  User,
  X,
  Award
} from 'lucide-react';
import Loader from '../components/Loader/Loader';
import Button from '../components/Button/Button';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchSharedReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await reportService.getReports();
        if (res.success && res.data) {
          setReports(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load shared reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedReports();
  }, []);

  // Keyboard accessibility: close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isReportModalOpen) {
        setIsReportModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReportModalOpen]);

  // Prevent background scroll when the modal is active
  useEffect(() => {
    if (isReportModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isReportModalOpen]);

  const getComplianceColorClass = (val) => {
    if (val >= 75) return 'from-emerald-500 to-teal-500'; // Green
    if (val >= 35) return 'from-amber-400 to-amber-600'; // Amber
    return 'from-rose-500 to-red-650'; // Red
  };

  const getComplianceTextColorClass = (val) => {
    if (val >= 75) return 'text-emerald-700';
    if (val >= 35) return 'text-amber-700';
    return 'text-rose-700';
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Extract patient details from latest shared report
  const latestReport = reports.length > 0 ? reports[0] : null;
  const childName = latestReport?.assessment?.patient?.fullName || "Your Child";
  const childAge = latestReport?.assessment?.patient?.age ? `${latestReport.assessment.patient.age} years` : "N/A";
  const diagnosis = latestReport?.assessment?.patient?.diagnosis || "Not Specified";

  // Compute dynamic skill compliance based on latest report metrics
  const domainMetrics = latestReport?.clinicalReport?.domainBreakdown || {};
  const receptiveCompliance = domainMetrics.receptiveLanguage || 0;
  const expressiveCompliance = domainMetrics.expressiveLanguage || 0;
  const socialCompliance = Math.round(
    ((domainMetrics.eyeContact || 0) + 
     (domainMetrics.jointAttention || 0) + 
     (domainMetrics.socialInteraction || 0)) / 3
  ) || 0;

  const overallProgress = Math.round(
    ((receptiveCompliance + expressiveCompliance + socialCompliance) / 3)
  ) || 0;

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setIsReportModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!selectedReport) return;

    try {
      // Create a temporary off-screen container for pixel-perfect PDF rendering
      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'fixed';
      pdfContainer.style.left = '-9999px';
      pdfContainer.style.top = '0';
      pdfContainer.style.width = '794px'; // standard A4 width in pixels at 96 DPI
      pdfContainer.style.backgroundColor = '#ffffff';
      pdfContainer.style.color = '#1e293b';
      pdfContainer.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      pdfContainer.style.padding = '48px';
      pdfContainer.style.boxSizing = 'border-box';

      // Load data
      const patientFullName = selectedReport.assessment?.patient?.fullName || childName;
      const evaluatorName = selectedReport.generatedBy?.fullName || "Clinical Speech Pathologist";
      const formattedDate = new Date(selectedReport.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      pdfContainer.innerHTML = `
        <div style="border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; font-family: inherit;">CAT Caregiver Communication Guide</h1>
          <p style="font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 0.05em; margin: 6px 0 0 0; font-family: inherit;">
            Speech Language Assessment Report Summary
          </p>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748b; margin-top: 8px; font-family: inherit;">
            <span><strong>Child Name:</strong> ${patientFullName}</span>
            <span><strong>Date:</strong> ${formattedDate}</span>
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px; font-family: inherit;">
            <span><strong>Evaluator:</strong> ${evaluatorName}</span>
          </div>
        </div>

        <div style="margin-bottom: 24px; font-family: inherit;">
          <h4 style="font-size: 13px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin: 0 0 8px 0; font-family: inherit;">
            Communication Summary
          </h4>
          <div style="font-size: 12px; color: #334155; line-height: 1.6; background-color: #f0fdf4; padding: 16px; border-radius: 8px; border: 1px solid #d1fae5; font-family: inherit; font-weight: 500;">
            ${selectedReport.caregiverReport?.summary || "No summary available."}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; font-family: inherit;">
          <div style="background-color: #f0fdf4; padding: 16px; border-radius: 8px; border: 1px solid #d1fae5; font-family: inherit;">
            <h4 style="font-size: 12px; font-weight: 700; color: #065f46; border-bottom: 1px solid #d1fae5; padding-bottom: 4px; margin: 0 0 10px 0; font-family: inherit;">
              Key Strengths
            </h4>
            <ul style="font-size: 11px; color: #334155; line-height: 1.6; padding-left: 16px; margin: 0; font-family: inherit; font-weight: 500;">
              ${(selectedReport.strengths || []).map(str => `<li style="margin-bottom: 4px; font-family: inherit;">${str}</li>`).join('')}
            </ul>
          </div>

          <div style="background-color: #fffbeb; padding: 16px; border-radius: 8px; border: 1px solid #fef3c7; font-family: inherit;">
            <h4 style="font-size: 12px; font-weight: 700; color: #92400e; border-bottom: 1px solid #fef3c7; padding-bottom: 4px; margin: 0 0 10px 0; font-family: inherit;">
              Areas to Practice
            </h4>
            <ul style="font-size: 11px; color: #334155; line-height: 1.6; padding-left: 16px; margin: 0; font-family: inherit; font-weight: 500;">
              ${(selectedReport.areasForImprovement || []).map(area => `<li style="margin-bottom: 4px; font-family: inherit;">${area}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div style="margin-bottom: 24px; font-family: inherit;">
          <h4 style="font-size: 13px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin: 0 0 10px 0; font-family: inherit;">
            Recommended Home & Daily Activities
          </h4>
          <div style="display: grid; grid-template-columns: 1fr; gap: 8px; font-family: inherit;">
            ${(selectedReport.caregiverReport?.homeStrategies || []).map(activity => `
              <div style="padding: 10px 14px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 11px; color: #334155; font-family: inherit; font-weight: 500;">
                &bull; ${activity}
              </div>
            `).join('')}
          </div>
        </div>

        <div style="margin-bottom: 24px; font-family: inherit;">
          <h4 style="font-size: 13px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin: 0 0 10px 0; font-family: inherit;">
            General Recommendations
          </h4>
          <div style="display: grid; grid-template-columns: 1fr; gap: 8px; font-family: inherit;">
            ${(selectedReport.recommendations || []).map((rec, idx) => `
              <div style="padding: 10px 14px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 11px; color: #334155; font-family: inherit; font-weight: 500;">
                <strong>${idx + 1}.</strong> ${rec}
              </div>
            `).join('')}
          </div>
        </div>

        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 40px; font-size: 10px; color: #94a3b8; font-family: inherit;">
          Generated automatically by CAT (Communication Assessment Tool) • Confidential Client Record
        </div>
      `;

      document.body.appendChild(pdfContainer);

      const canvas = await html2canvas(pdfContainer, {
        scale: 2, // High resolution capture
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(pdfContainer);

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // A4 width: 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // A4 height: 297mm
      
      const margin = 12; // 12mm page margin
      const imgWidth = pdfWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      // Add first page
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - (margin * 2));

      // Handle pagination seamlessly if the guide spans multiple pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - (margin * 2));
      }

      // Generate filename: PatientName_Report_YYYY-MM-DD.pdf
      const cleanPatientName = patientFullName.replace(/[^a-zA-Z0-9]/g, '_');
      const isoDate = new Date(selectedReport.createdAt).toISOString().split('T')[0];
      const filename = `${cleanPatientName}_Report_${isoDate}.pdf`;

      pdf.save(filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("An error occurred during PDF creation. Please use the Print Report button instead.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 font-sans text-slate-800 pb-12 print:bg-white print:pb-0">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-emerald-100/80 sticky top-0 z-50 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-100">
              <Heart className="w-5.5 h-5.5 fill-white" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-base block leading-none">CAT Caregiver</span>
              <span className="text-[10px] text-emerald-600 font-semibold tracking-wider uppercase mt-0.5 block">Parent Portal</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-slate-700 block">{user?.email}</span>
              <span className="text-[10px] text-slate-455 font-semibold">Child Profile: {childName}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:border-red-200 text-xs font-semibold text-slate-600 hover:text-red-655 rounded-xl bg-white hover:bg-red-50/50 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:hidden">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl border border-emerald-100 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
          
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-755 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-emerald-600 fill-emerald-600" />
              <span>Interactive Care Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3.5xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.fullName || 'Parent'}!
            </h1>
            <p className="text-sm text-emerald-800 font-medium">
              Here is your daily tracking overview for <strong className="text-slate-900">{childName}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50/80 px-4 py-2.5 rounded-xl border border-slate-200 self-start md:self-auto z-10">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>{currentDate}</span>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <FileText className="w-12 h-12 text-slate-350 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Reports Shared Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Your child's speech-language pathologist has not shared any reports with your account yet. Shared assessments will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUMN 1: Child details, Latest Report, and Report History List */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Child Profile Widget */}
              <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-455 font-bold uppercase block">Child Name</span>
                    <span className="font-extrabold text-slate-900 text-sm">{childName}</span>
                  </div>
                </div>
                <div className="border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-4 flex items-center">
                  <div>
                    <span className="text-[10px] text-slate-455 font-bold uppercase block">Age / Gender</span>
                    <span className="font-semibold text-slate-800 text-xs">
                      {childAge} • {latestReport?.assessment?.patient?.gender || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-4 flex items-center">
                  <div>
                    <span className="text-[10px] text-slate-455 font-bold uppercase block">Diagnosis</span>
                    <span className="font-semibold text-slate-800 text-xs">{diagnosis}</span>
                  </div>
                </div>
              </div>

              {/* Latest Report preview card */}
              <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <span>Latest Report</span>
                  </h2>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-550/10 border border-emerald-200 px-2 py-0.5 rounded">
                    Newest
                  </span>
                </div>
                {latestReport && (
                  <div className="p-4 bg-emerald-50/10 border border-emerald-100 rounded-xl space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">
                          Milestone Evaluation
                        </h4>
                        <p className="text-[10px] text-slate-455 mt-0.5">
                          Shared by {latestReport.generatedBy?.fullName || "Clinical Speech Pathologist"} on {latestReport.sharedAt ? new Date(latestReport.sharedAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[9px] font-bold">
                        {latestReport.clinicalReport?.isAiGenerated ? 'AI Generated' : 'Standard'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-medium">
                      {latestReport.caregiverReport?.summary}
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleViewReport(latestReport)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg border border-emerald-600 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>View Latest Report</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Shared Reports History List */}
              <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <span>Report History</span>
                  </h2>
                  <p className="text-[11px] text-slate-500">All historical clinical assessments shared with you</p>
                </div>

                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report._id || report.id}
                      className="p-4 bg-white border border-slate-200 hover:border-emerald-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-emerald-50/10 shadow-3xs"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-xs">{report.assessment?.patient?.fullName || childName}</span>
                          <span className="text-[9px] font-bold text-slate-400">•</span>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200/60 px-1.5 py-0.5 rounded">
                            {report.clinicalReport?.isAiGenerated ? 'AI Generated' : 'Standard'}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-705 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                            Status: Shared
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-[11px] text-slate-550 font-semibold">
                          <p><span className="text-slate-400 font-medium">Assessment Date:</span> {new Date(report.assessment?.assessmentDate || report.createdAt).toLocaleDateString()}</p>
                          <p><span className="text-slate-400 font-medium">Doctor:</span> {report.generatedBy?.fullName || "Clinical Team"}</p>
                          <p><span className="text-slate-400 font-medium">Shared Date:</span> {report.sharedAt ? new Date(report.sharedAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewReport(report)}
                        className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 self-start md:self-auto"
                      >
                        <span>View Report</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* COLUMN 2: Sidebar Widgets (Activities, Videos, Progress Compliance Metrics) */}
            <div className="space-y-8">
              
              {/* Progress Compliance Metrics */}
              <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <span>Progress Overview</span>
                  </h2>
                  <p className="text-[11px] text-slate-500">Current developmental metric baselines</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Receptive Language</span>
                      <span className={getComplianceTextColorClass(receptiveCompliance)}>{receptiveCompliance}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`bg-gradient-to-r ${getComplianceColorClass(receptiveCompliance)} h-full rounded-full`} style={{ width: `${receptiveCompliance}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Expressive Language</span>
                      <span className={getComplianceTextColorClass(expressiveCompliance)}>{expressiveCompliance}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`bg-gradient-to-r ${getComplianceColorClass(expressiveCompliance)} h-full rounded-full`} style={{ width: `${expressiveCompliance}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Social/Attention</span>
                      <span className={getComplianceTextColorClass(socialCompliance)}>{socialCompliance}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`bg-gradient-to-r ${getComplianceColorClass(socialCompliance)} h-full rounded-full`} style={{ width: `${socialCompliance}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Caregiver Recommended Activities */}
              <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-emerald-600" />
                    <span>Home Activities</span>
                  </h2>
                  <p className="text-[11px] text-slate-500">Therapist recommended daily tasks</p>
                </div>

                <div className="space-y-3">
                  {latestReport?.caregiverReport?.homeStrategies && latestReport.caregiverReport.homeStrategies.length > 0 ? (
                    latestReport.caregiverReport.homeStrategies.map((strategy, idx) => (
                      <div key={idx} className="p-3 bg-emerald-50/30 border border-emerald-100/50 rounded-xl flex gap-3">
                        <div className="p-1.5 rounded-lg bg-emerald-600/10 text-emerald-600 flex-shrink-0 h-fit mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <p className="text-xs text-slate-700 leading-snug">{strategy}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="p-3 bg-emerald-50/30 border border-emerald-100/50 rounded-xl flex gap-3">
                        <div className="p-1.5 rounded-lg bg-emerald-600/10 text-emerald-655 flex-shrink-0 h-fit mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Visual Naming Game</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">Point to household objects and vocalize name (15 mins/day).</p>
                        </div>
                      </div>
                      <div className="p-3 bg-emerald-50/30 border border-emerald-100/50 rounded-xl flex gap-3">
                        <div className="p-1.5 rounded-lg bg-emerald-600/10 text-emerald-655 flex-shrink-0 h-fit mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Rhythmic Syllables Clapping</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">Clap together on word-syllables during story time (10 mins/day).</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Teaching Videos Widget */}
              <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Video className="w-4.5 h-4.5 text-emerald-600" />
                    <span>Teaching Videos</span>
                  </h2>
                  <p className="text-[11px] text-slate-500">Therapist guidance tutorials</p>
                </div>

                <div className="space-y-3">
                  <div 
                    onClick={() => navigate('/teaching-videos')}
                    className="group p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <PlayCircle className="w-7 h-7 text-emerald-600 group-hover:scale-105 transition-transform" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-tight">Introduction to Phonetics</h4>
                        <p className="text-[10px] text-slate-400">Duration: 8 mins</p>
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => navigate('/teaching-videos')}
                    className="group p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <PlayCircle className="w-7 h-7 text-emerald-600 group-hover:scale-105 transition-transform" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-tight">Interactive Play Strategies</h4>
                        <p className="text-[10px] text-slate-400">Duration: 12 mins</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Parent Report Viewer Modal (Parent-safe fields only, clinical internals hidden) */}
      {isReportModalOpen && selectedReport && (
        <div 
          onClick={(e) => {
            // Close on backdrop click
            if (e.target === e.currentTarget) {
              setIsReportModalOpen(false);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs font-sans"
        >
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden print-report-modal">
            
            {/* Modal Header (Stays visible while scrolling) */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10 print:hidden">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Caregiver Home Support Guide
                </h3>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-250 hover:border-emerald-500 hover:text-emerald-700 text-[11px] font-bold text-slate-600 rounded-lg bg-white transition-all cursor-pointer"
                  title="Print report"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print Report</span>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-[11px] font-bold text-white rounded-lg border border-emerald-600 transition-all cursor-pointer"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </button>
                <div className="w-px h-5 bg-slate-200 mx-1" />
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  className="text-slate-400 hover:text-slate-650 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
              
              {/* Print Friendly Header (Only visible on print) */}
              <div className="hidden print:block border-b border-gray-300 pb-4 mb-6">
                <h1 className="text-xl font-extrabold text-gray-900">CAT Caregiver Communication Guide</h1>
                <p className="text-xs text-gray-500 mt-1">
                  Child Name: <strong>{selectedReport.assessment?.patient?.fullName}</strong> • Date: {new Date(selectedReport.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-550">Evaluated by: {selectedReport.generatedBy?.fullName || "Clinical Speech Pathologist"}</p>
              </div>

              {/* Section 1: Friendly Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider block border-b border-emerald-100 pb-1 flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-emerald-100 text-emerald-600" />
                  <span>Communication Summary</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium bg-emerald-50/20 p-4 rounded-xl border border-emerald-100">
                  {selectedReport.caregiverReport?.summary}
                </p>
              </div>

              {/* Section 2: Strengths & Focus Areas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 bg-emerald-50/30 p-4 rounded-xl border border-emerald-100">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-2 border-b border-emerald-100 pb-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-605" /> Key Strengths
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 leading-relaxed font-medium">
                    {(selectedReport.strengths || []).map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 bg-amber-50/40 p-4 rounded-xl border border-amber-100/70">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 mb-2 border-b border-amber-100 pb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-605" /> Areas to Practice
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 leading-relaxed font-medium">
                    {(selectedReport.areasForImprovement || []).map((area, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Section 3: Home & Daily Activities */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider block border-b border-emerald-100 pb-1 flex items-center gap-1">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Recommended Home & Daily Activities</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {(selectedReport.caregiverReport?.homeStrategies || []).map((activity, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2 font-medium">
                      <span className="font-bold text-emerald-600 mt-0.5">•</span>
                      <span>{activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Careplan Recommendations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider block border-b border-emerald-100 pb-1 flex items-center gap-1">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>General Recommendations</span>
                </h4>
                <div className="space-y-2 mt-2">
                  {(selectedReport.recommendations || []).map((rec, idx) => (
                    <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2.5 font-medium">
                      <span className="font-bold text-emerald-600">{idx + 1}.</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Modal Footer (Hidden in print) */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2 print:hidden">
              <Button
                variant="outline"
                onClick={() => setIsReportModalOpen(false)}
                className="text-xs border-slate-250 cursor-pointer"
              >
                Close
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Embedded CSS for printing print: block elements correctly */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-report-modal, .print-report-modal * {
            visibility: visible;
          }
          .print-report-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .hidden.print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
