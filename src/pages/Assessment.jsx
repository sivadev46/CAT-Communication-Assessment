import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Save,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Award,
  Loader2,
  Trash2,
  Sparkles
} from 'lucide-react';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import Modal from '../components/Modal/Modal';
import SkeletonLoader from '../components/Loader/SkeletonLoader';
import { assessmentCategories } from '../data/assessmentData';
import { patientService } from '../services/patientService';
import { assessmentService } from '../services/assessmentService';
import { reportService } from '../services/reportService';
import { useAuth } from '../context/AuthContext';

export default function Assessment() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Patients list from API & selected patient
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loadingPatients, setLoadingPatients] = useState(true);

  // Active Assessment ID if loaded
  const [currentAssessmentId, setCurrentAssessmentId] = useState(null);

  // State for responses: { [itemId]: 'present' | 'absent' }
  const [responses, setResponses] = useState({});
  // State for notes: { [itemId]: string }
  const [notes, setNotes] = useState({});

  // Active category index for tabbed/accordion focus
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  // Expanded category IDs for accordion
  const [expandedCategories, setExpandedCategories] = useState({
    'eye-contact': true,
    'joint-attention': true,
    'receptive-language': true,
    'expressive-language': true,
    'social-interaction': true,
  });

  // Save validation state
  const [validationError, setValidationError] = useState(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI report states
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Fetch patients list from backend API
  useEffect(() => {
    const loadPatients = async () => {
      setLoadingPatients(true);
      try {
        const res = await patientService.getPatients({ limit: 50 });
        if (res.success && res.data?.patients?.length) {
          setPatients(res.data.patients);
          setSelectedPatientId(res.data.patients[0]._id);
          setSelectedPatient(res.data.patients[0]);
        }
      } catch (err) {
        console.error('Error fetching patients for assessment:', err);
      } finally {
        setLoadingPatients(false);
      }
    };
    loadPatients();
  }, []);

  // Load patient's latest assessment if it exists
  useEffect(() => {
    const loadPatientAssessment = async () => {
      if (!selectedPatientId) {
        setCurrentAssessmentId(null);
        setResponses({});
        setNotes({});
        return;
      }
      
      try {
        const res = await assessmentService.getAssessmentsByPatient(selectedPatientId);
        if (res.success && res.data?.assessments?.length > 0) {
          const latest = res.data.assessments[0];
          setCurrentAssessmentId(latest._id || latest.id);
          
          // Reconstruct clinician notes from JSON if stored
          if (latest.notes) {
            try {
              const parsedNotes = JSON.parse(latest.notes);
              setNotes(parsedNotes);
            } catch {
              setNotes({ general: latest.notes });
            }
          } else {
            setNotes({});
          }

          // Reconstruct responses from responses field or category scores
          let newResponses = {};
          if (latest.responses) {
            try {
              newResponses = JSON.parse(latest.responses);
            } catch {
              newResponses = {};
            }
          }
          
          if (Object.keys(newResponses).length === 0) {
            assessmentCategories.forEach(category => {
              const fieldName = category.id === 'eye-contact' ? 'eyeContact' : 
                                category.id === 'joint-attention' ? 'jointAttention' :
                                category.id === 'receptive-language' ? 'receptiveLanguage' :
                                category.id === 'expressive-language' ? 'expressiveLanguage' :
                                'socialInteraction';
              const scorePercentage = latest[fieldName] || 0;
              const totalItems = category.items.length;
              const presentCount = Math.round((scorePercentage / 100) * totalItems);
              category.items.forEach((item, idx) => {
                newResponses[item.id] = idx < presentCount ? 'present' : 'absent';
              });
            });
          }
          setResponses(newResponses);
        } else {
          // If no assessment exists, reset form responses for this patient
          setCurrentAssessmentId(null);
          setResponses({});
          setNotes({});
        }
      } catch (err) {
        console.error('Error loading patient assessment:', err);
        setCurrentAssessmentId(null);
        setResponses({});
        setNotes({});
      }
    };

    // Reset alert states when switching patients
    setValidationError(null);
    setSaveSuccessMessage(false);
    setAiError(null);

    loadPatientAssessment();
  }, [selectedPatientId]);

  // Handle selecting a patient
  const handleSelectPatient = (e) => {
    const id = e.target.value;
    setSelectedPatientId(id);
    const pt = patients.find((p) => (p._id || p.id) === id);
    setSelectedPatient(pt || null);
  };

  // Total items count across all categories
  const allItems = useMemo(() => {
    return assessmentCategories.flatMap((cat) => cat.items);
  }, []);

  const totalItemsCount = allItems.length;

  // Calculate scores and progress dynamically
  const scores = useMemo(() => {
    let completedCount = 0;
    let totalPoints = 0;
    let totalPresent = 0;
    let totalPartiallyPresent = 0;
    let totalAbsent = 0;

    const categoryStats = assessmentCategories.map((category) => {
      let catCompleted = 0;
      let catPoints = 0;
      let catPresent = 0;
      let catPartiallyPresent = 0;
      let catAbsent = 0;

      category.items.forEach((item) => {
        const response = responses[item.id];
        if (response) {
          catCompleted += 1;
          completedCount += 1;
          if (response === 'present') {
            catPresent += 1;
            catPoints += 1;
            totalPresent += 1;
            totalPoints += 1;
          } else if (response === 'partially-present') {
            catPartiallyPresent += 1;
            catPoints += 0.5;
            totalPartiallyPresent += 1;
            totalPoints += 0.5;
          } else if (response === 'absent') {
            catAbsent += 1;
            totalAbsent += 1;
          }
        }
      });

      const catTotal = category.items.length;
      const catPercentage = catTotal > 0 ? Math.round((catPoints / catTotal) * 100) : 0;
      const catCompletionPercentage = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;

      return {
        id: category.id,
        name: category.name,
        completed: catCompleted,
        total: catTotal,
        present: catPresent,
        partiallyPresent: catPartiallyPresent,
        absent: catAbsent,
        scorePercentage: catPercentage,
        completionPercentage: catCompletionPercentage,
        isComplete: catCompleted === catTotal,
      };
    });

    const remainingCount = totalItemsCount - completedCount;
    const completionPercentage = Math.round((completedCount / totalItemsCount) * 100);
    const overallPercentage = completedCount > 0 ? Math.round((totalPoints / totalItemsCount) * 100) : 0;
    const isFullyComplete = completedCount === totalItemsCount;

    return {
      completedCount,
      remainingCount,
      totalItemsCount,
      totalPresent,
      totalPartiallyPresent,
      totalAbsent,
      totalPoints,
      completionPercentage,
      overallPercentage,
      isFullyComplete,
      categoryStats,
    };
  }, [responses, totalItemsCount]);

  // Handle present/absent toggle selection
  const handleToggle = (itemId, val) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === val ? undefined : val,
    }));
    if (validationError) {
      setValidationError(null);
    }
  };

  // Handle notes change
  const handleNotesChange = (itemId, text) => {
    setNotes((prev) => ({
      ...prev,
      [itemId]: text,
    }));
  };

  // Toggle category collapse
  const toggleCategoryExpand = (catId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Reset all assessment responses
  const handleReset = () => {
    setResponses({});
    setNotes({});
    setValidationError(null);
    setSaveSuccessMessage(false);
    setIsResetModalOpen(false);
    setCurrentAssessmentId(null);
  };

  // Save assessment to Backend REST API
  const handleSave = async () => {
    if (!selectedPatientId) {
      setValidationError('Please select or create a patient first before saving.');
      return;
    }

    const unansweredItems = allItems.filter((item) => !responses[item.id]);

    if (unansweredItems.length > 0) {
      const firstUnanswered = unansweredItems[0];
      const parentCat = assessmentCategories.find((cat) =>
        cat.items.some((item) => item.id === firstUnanswered.id)
      );

      if (parentCat) {
        setExpandedCategories((prev) => ({
          ...prev,
          [parentCat.id]: true,
        }));
      }

      setValidationError(
        `Please complete all items before saving. ${unansweredItems.length} item(s) remaining.`
      );
      setSaveSuccessMessage(false);
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      const catMap = Object.fromEntries(
        scores.categoryStats.map((s) => [s.id, s.scorePercentage])
      );

      const payload = {
        patientId: selectedPatientId,
        eyeContact: catMap['eye-contact'] || 0,
        jointAttention: catMap['joint-attention'] || 0,
        receptiveLanguage: catMap['receptive-language'] || 0,
        expressiveLanguage: catMap['expressive-language'] || 0,
        socialInteraction: catMap['social-interaction'] || 0,
        notes: JSON.stringify(notes),
        status: 'Completed',
      };

      let res;
      if (currentAssessmentId) {
        res = await assessmentService.updateAssessment(currentAssessmentId, payload);
      } else {
        res = await assessmentService.createAssessment(payload);
        if (res.data?._id) {
          setCurrentAssessmentId(res.data._id);
        }
      }

      if (res.success) {
        setSaveSuccessMessage(true);
        setTimeout(() => {
          setSaveSuccessMessage(false);
        }, 4000);
      }
    } catch (err) {
      setValidationError(err.response?.data?.message || 'Error saving assessment to backend server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete current assessment via API
  const handleDeleteAssessment = async () => {
    if (!currentAssessmentId) return;
    setIsSubmitting(true);
    try {
      const res = await assessmentService.deleteAssessment(currentAssessmentId);
      if (res.success) {
        handleReset();
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete assessment record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate AI Report calling backend
  const handleGenerateAIReport = async () => {
    if (!currentAssessmentId) return;

    setIsGeneratingAI(true);
    setAiError(null);
    try {
      const res = await reportService.generateAIReport({ assessmentId: currentAssessmentId });
      if (res.success) {
        navigate('/reports', { state: { highlightReportId: res.data?._id || res.data?.id } });
      } else {
        setAiError(res.message || 'AI Generation returned a failure response.');
      }
    } catch (err) {
      setAiError(err.response?.data?.message || 'Error communicating with Google Gemini AI backend.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Navigation between categories
  const handlePrevCategory = () => {
    if (activeCategoryIndex > 0) {
      setActiveCategoryIndex((prev) => prev - 1);
    }
  };

  const handleNextCategory = () => {
    if (activeCategoryIndex < assessmentCategories.length - 1) {
      setActiveCategoryIndex((prev) => prev + 1);
    }
  };

  if (loadingPatients) {
    return (
      <div className="space-y-6 pb-12">
        <SkeletonLoader count={1} />
        <SkeletonLoader count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* AI Generating Loading Overlay */}
      {isGeneratingAI && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center space-y-4 shadow-2xl border border-indigo-100 bg-white">
            <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100 shadow-xs">
              <Sparkles className="w-8 h-8 fill-indigo-650 animate-pulse text-indigo-650" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Generating AI Report</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Google Gemini is analyzing patient records, evaluation metrics, and clinician notes to formulate structured professional summaries and parent care guides.
            </p>
            <div className="flex items-center justify-center gap-2 text-indigo-655 font-bold text-xs pt-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing and formulating...</span>
            </div>
          </Card>
        </div>
      )}

      {/* Top Patient Selector & Header Info */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Patient Details & Selector */}
          <div className="flex items-start gap-4 flex-1">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg bg-blue-100 text-blue-700 shadow-xs flex-shrink-0">
              {selectedPatient?.fullName
                ? selectedPatient.fullName.slice(0, 2).toUpperCase()
                : 'PT'}
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <label htmlFor="patient-select" className="text-xs font-bold text-gray-500 uppercase">Select Active Patient:</label>
                <select
                  id="patient-select"
                  value={selectedPatientId}
                  onChange={handleSelectPatient}
                  className="py-1.5 px-3 text-xs font-bold bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {patients.map((p) => (
                    <option key={p._id || p.id} value={p._id || p.id}>
                      {p.fullName} ({p.patientId || 'ID'}) - {p.diagnosis || 'Diagnosis Pending'}
                    </option>
                  ))}
                </select>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${scores.isFullyComplete ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                  {scores.isFullyComplete ? 'Status: Complete' : 'Status: In Progress'}
                </span>
              </div>
              {selectedPatient && (
                <p className="text-xs md:text-sm text-gray-600 font-medium">
                  {selectedPatient.age} yrs • {selectedPatient.gender || 'Patient'} • <span className="text-gray-900 font-semibold">Diagnosis:</span> {selectedPatient.diagnosis || 'N/A'}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" /> {new Date().toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-600" /> Clinician: {user?.fullName || 'Dr. Sarah Jenkins'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Progress Banner */}
          <div className="lg:w-72 bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              <span className="text-gray-700">Assessment Progress</span>
              <span className="text-blue-700">{scores.completionPercentage}%</span>
            </div>
            <ProgressBar progress={scores.completionPercentage} />
            <div className="flex justify-between items-center text-xs text-gray-500 mt-2 font-medium">
              <span>Completed: {scores.completedCount}/{scores.totalItemsCount}</span>
              <span>Remaining: {scores.remainingCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">Assessment saved successfully! You can now generate an AI Clinical Report.</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              onClick={handleGenerateAIReport}
              className="text-xs !py-1 px-3 bg-emerald-650 hover:bg-emerald-700 text-white flex items-center gap-1 cursor-pointer border border-emerald-650"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
              <span>Generate AI Report</span>
            </Button>
            <button onClick={() => setSaveSuccessMessage(false)} className="text-emerald-600 hover:text-emerald-850 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* AI Error Banner */}
      {aiError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-center justify-between text-sm shadow-xs animate-shake">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span className="font-semibold">{aiError}</span>
          </div>
          <button onClick={() => setAiError(null)} className="text-rose-600 hover:text-rose-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Validation Error Banner */}
      {validationError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-center justify-between text-sm shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span className="font-semibold">{validationError}</span>
          </div>
          <button onClick={() => setValidationError(null)} className="text-rose-600 hover:text-rose-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Left Assessment Categories vs Right Summary Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Categories & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Navigation Bar / Tabs */}
          <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-gray-200 shadow-xs overflow-x-auto gap-1">
            {assessmentCategories.map((cat, idx) => {
              const catStat = scores.categoryStats.find((s) => s.id === cat.id);
              const isActive = activeCategoryIndex === idx;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategoryIndex(idx);
                    setExpandedCategories((prev) => ({ ...prev, [cat.id]: true }));
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span>{cat.name.split('.')[1] || cat.name}</span>
                  {catStat?.isComplete ? (
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-emerald-500'}`} />
                  ) : (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded ${isActive ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {catStat?.completed}/{catStat?.total}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Collapsible Category Cards */}
          <div className="space-y-4">
            {assessmentCategories.map((category, catIdx) => {
              const catStat = scores.categoryStats.find((s) => s.id === category.id);
              const isExpanded = !!expandedCategories[category.id];
              const isCurrentFocus = activeCategoryIndex === catIdx;

              return (
                <div
                  key={category.id}
                  className={`bg-white rounded-xl border transition-all duration-200 shadow-xs overflow-hidden ${
                    isCurrentFocus ? 'border-blue-400 ring-2 ring-blue-500/10' : 'border-gray-200'
                  }`}
                >
                  {/* Category Card Header */}
                  <div
                    onClick={() => {
                      toggleCategoryExpand(category.id);
                      setActiveCategoryIndex(catIdx);
                    }}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer bg-gray-50/70 hover:bg-gray-50 border-b border-gray-100 select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">{category.name}</h3>
                        <p className="text-xs text-gray-500">{category.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-bold text-gray-900">
                          Score: <span className="text-blue-600">{catStat?.points}/{catStat?.total}</span> ({catStat?.scorePercentage}%)
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium">
                          {catStat?.completed === catStat?.total ? 'Completed' : `${catStat?.completed}/${catStat?.total} answered`}
                        </p>
                      </div>

                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Category Items List */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6 space-y-6">
                      {category.items.map((item, itemIdx) => {
                        const currentVal = responses[item.id];
                        const isUnanswered = validationError && !currentVal;

                        return (
                          <div
                            key={item.id}
                            className={`p-4 rounded-xl border transition-colors ${
                              isUnanswered
                                ? 'border-rose-300 bg-rose-50/40 ring-2 ring-rose-400/20'
                                : currentVal === 'present'
                                ? 'border-emerald-200 bg-emerald-50/20'
                                : currentVal === 'partially-present'
                                ? 'border-amber-200 bg-amber-50/20'
                                : currentVal === 'absent'
                                ? 'border-rose-200 bg-rose-50/20'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-gray-400">#{itemIdx + 1}</span>
                                  <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>

                              <div className="grid grid-cols-3 gap-2 w-full sm:w-72 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleToggle(item.id, 'present')}
                                  className={`py-2 px-1 rounded-lg text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 border transition-all cursor-pointer text-center ${
                                    currentVal === 'present'
                                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                      : 'bg-white text-gray-700 border-gray-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                                  }`}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span>Present</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggle(item.id, 'partially-present')}
                                  className={`py-2 px-1 rounded-lg text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 border transition-all cursor-pointer text-center ${
                                    currentVal === 'partially-present'
                                      ? 'bg-amber-550 text-white border-amber-550 shadow-xs'
                                      : 'bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300'
                                  }`}
                                >
                                  <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[8px] font-black flex-shrink-0">P</span>
                                  <span>Partial</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggle(item.id, 'absent')}
                                  className={`py-2 px-1 rounded-lg text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 border transition-all cursor-pointer text-center ${
                                    currentVal === 'absent'
                                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                      : 'bg-white text-gray-700 border-gray-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300'
                                  }`}
                                >
                                  <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span>Absent</span>
                                </button>
                              </div>
                            </div>

                            <div className="mt-3.5 pt-3 border-t border-gray-100">
                              <label htmlFor={`notes-${item.id}`} className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Clinical Notes (Optional)
                              </label>
                              <textarea
                                id={`notes-${item.id}`}
                                rows={2}
                                value={notes[item.id] || ''}
                                onChange={(e) => handleNotesChange(item.id, e.target.value)}
                                placeholder="Add specific behavioral observations, environmental context, or prompts used..."
                                className="w-full p-2.5 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Category Step Navigation & Action Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            {!currentAssessmentId ? (
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  onClick={handlePrevCategory}
                  disabled={activeCategoryIndex === 0}
                  className="flex-1 md:flex-none text-xs flex items-center justify-center gap-1 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous Category
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNextCategory}
                  disabled={activeCategoryIndex === assessmentCategories.length - 1}
                  className="flex-1 md:flex-none text-xs flex items-center justify-center gap-1 disabled:opacity-40 cursor-pointer"
                >
                  Next Category <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ) : null}

            <div className={`flex flex-wrap items-center gap-2 w-full ${currentAssessmentId ? 'justify-end' : 'md:w-auto justify-end'}`}>
              <Button
                variant="outline"
                onClick={() => setIsResetModalOpen(true)}
                className="text-xs text-gray-650 hover:text-rose-600 flex items-center justify-center gap-1 cursor-pointer flex-1 sm:flex-none"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </Button>
              {currentAssessmentId && (
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200 flex items-center justify-center gap-1 cursor-pointer flex-1 sm:flex-none"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="text-xs text-gray-655 flex items-center justify-center gap-1 cursor-pointer flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              {currentAssessmentId && (
                <Button
                  variant="primary"
                  onClick={handleGenerateAIReport}
                  disabled={isSubmitting || isGeneratingAI}
                  className="text-xs bg-indigo-650 hover:bg-indigo-700 text-white flex items-center justify-center gap-1 px-4 cursor-pointer flex-1 sm:flex-none"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Generate AI Report</span>
                </Button>
              )}
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSubmitting || isGeneratingAI}
                className="text-xs flex items-center justify-center gap-1 px-5 cursor-pointer flex-1 sm:flex-none"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Assessment</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Side Summary Panel */}
        <div className="space-y-6">
          <Card className="!p-5 space-y-5 sticky top-20">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-base">Automatic Scoring Summary</h3>
              </div>
              <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${scores.isFullyComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {scores.isFullyComplete ? 'COMPLETE' : 'INCOMPLETE'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100">
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Overall Score</p>
                <p className="text-2xl font-extrabold text-blue-900 mt-1">{scores.overallPercentage}%</p>
                <p className="text-[10px] text-blue-700 font-medium mt-0.5">{scores.totalPoints}/{scores.totalItemsCount} Points</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Completion</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">{scores.completionPercentage}%</p>
                <p className="text-[10px] text-gray-600 font-medium mt-0.5">{scores.completedCount}/{scores.totalItemsCount} Answered</p>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-b border-gray-100 py-3">
              <div className="flex justify-between items-center text-gray-600">
                <span>Present Behaviors (1 pt)</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{scores.totalPresent}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Partially Present (0.5 pt)</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{scores.totalPartiallyPresent}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Absent Behaviors (0 pt)</span>
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">{scores.totalAbsent}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Unanswered Items</span>
                <span className="font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{scores.remainingCount}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Category Breakdown
              </h4>
              <div className="space-y-3">
                {scores.categoryStats.map((catStat) => (
                  <div key={catStat.id} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-gray-800 truncate max-w-[180px]">
                        {catStat.name}
                      </span>
                      <span className="font-bold text-gray-900">
                        {catStat.points}/{catStat.total} <span className="text-gray-400 font-normal">({catStat.scorePercentage}%)</span>
                      </span>
                    </div>
                    <ProgressBar progress={catStat.scorePercentage} />
                  </div>
                ))}
              </div>
            </div>

            {selectedPatient && (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1">
                <p className="font-bold text-gray-800">Patient File: {selectedPatient.fullName}</p>
                <p className="text-gray-500">MRN: {selectedPatient.patientId || 'N/A'}</p>
                <p className="text-gray-500">Evaluator: {user?.fullName || 'Clinician'}</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Assessment Form?"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Are you sure you want to clear all responses and clinical notes for this assessment session? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsResetModalOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleReset}
              className="text-xs !bg-rose-600 hover:!bg-rose-700 text-white"
            >
              Reset All Responses
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Assessment Record?"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Are you sure you want to delete this assessment record from the database?
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteAssessment}
              disabled={isSubmitting}
              className="text-xs !bg-rose-600 hover:!bg-rose-700 text-white"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Record'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
