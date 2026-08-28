import React, { useState, useEffect } from 'react';
import AssessmentHeader from './AssessmentHeader';
import AssessmentActivity from './AssessmentActivity';
import { therapyActivities } from '../../data/therapyActivitiesData';
import { CheckCircle2, RotateCcw, Award, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AssessmentEngine({
  patient,
  role = 'therapist', // 'therapist' | 'parent'
  onComplete,
  onExit,
}) {
  const navigate = useNavigate();

  // Load active activities list (defaults to the 21 Module 1 activities)
  const [activities] = useState(therapyActivities);
  
  // Current activity index (0-indexed, so step 1 = index 0)
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!patient?.id) return 0;
    const saved = localStorage.getItem(`cat_assessment_step_${patient.id}`);
    return saved ? parseInt(saved, 10) : 0;
  });

  // State for recorded responses: { [activityId]: { selectedRange, videoSubmission } }
  const [responses, setResponses] = useState(() => {
    if (!patient?.id) return {};
    const saved = localStorage.getItem(`cat_assessment_responses_${patient.id}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentActivity = activities[currentIndex] || activities[0];
  const currentStep = currentIndex + 1;
  const totalSteps = activities.length;

  // Persist progress locally for instant resume support
  useEffect(() => {
    if (patient?.id) {
      localStorage.setItem(`cat_assessment_step_${patient.id}`, currentIndex.toString());
      localStorage.setItem(`cat_assessment_responses_${patient.id}`, JSON.stringify(responses));
    }
  }, [currentIndex, responses, patient?.id]);

  const handleSelectedRangeChange = (rangeValue) => {
    if (!currentActivity) return;
    setResponses((prev) => ({
      ...prev,
      [currentActivity.id]: {
        ...(prev[currentActivity.id] || {}),
        selectedRange: rangeValue,
      },
    }));
  };

  const handleActivitySubmit = async (activityResult) => {
    setIsSubmitting(true);

    const updatedResponses = {
      ...responses,
      [activityResult.activityId]: {
        selectedRange: activityResult.selectedRange,
        videoSubmission: activityResult.videoSubmission || null,
        performedByRole: role,
        reviewStatus: role === 'parent' ? 'pending_review' : 'approved',
        submittedAt: new Date().toISOString(),
      },
    };

    setResponses(updatedResponses);

    // Save to storage / Supabase backend
    try {
      if (patient?.id) {
        localStorage.setItem(`cat_assessment_responses_${patient.id}`, JSON.stringify(updatedResponses));
      }
    } catch (err) {
      console.error('Error saving response:', err);
    } finally {
      setIsSubmitting(false);
    }

    // Advance to next activity or complete assessment
    if (currentIndex + 1 < totalSteps) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      if (onComplete) {
        onComplete(updatedResponses);
      }
    }
  };

  const handleResetAssessment = () => {
    if (patient?.id) {
      localStorage.removeItem(`cat_assessment_step_${patient.id}`);
      localStorage.removeItem(`cat_assessment_responses_${patient.id}`);
    }
    setCurrentIndex(0);
    setResponses({});
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 shadow-lg">
          <Award className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100">
          Module 1 Assessment Completed!
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400 max-w-md mx-auto">
          {role === 'parent'
            ? 'Thank you! Your assessment responses and recorded video sessions have been submitted and are pending clinician review.'
            : 'All 21 activities have been evaluated. Official patient progress and report metrics have been updated.'}
        </p>

        <div className="p-4 bg-gray-50 dark:bg-slate-850/60 rounded-2xl border border-gray-200 dark:border-slate-800 text-left max-w-md mx-auto space-y-2 text-xs">
          <div className="flex justify-between text-gray-700 dark:text-slate-300">
            <span>Patient Name:</span>
            <strong className="font-semibold text-gray-900 dark:text-slate-100">{patient?.fullName || patient?.name}</strong>
          </div>
          <div className="flex justify-between text-gray-700 dark:text-slate-300">
            <span>Evaluated Activities:</span>
            <strong className="font-semibold text-emerald-600">21 / 21</strong>
          </div>
          <div className="flex justify-between text-gray-700 dark:text-slate-300">
            <span>Status:</span>
            <strong className="font-semibold text-blue-600">
              {role === 'parent' ? 'Submitted (Pending Review)' : 'Official Assessment Logged'}
            </strong>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={handleResetAssessment}
            className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Assessment
          </button>
          <button
            type="button"
            onClick={() => navigate(role === 'parent' ? '/parent-dashboard' : '/reports')}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            View Reports
          </button>
        </div>
      </div>
    );
  }

  const activeSavedRange = responses[currentActivity?.id]?.selectedRange || '';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header with Progress Bar */}
      <AssessmentHeader
        moduleTitle="Pre-Intentional Communication Tool"
        ageRange="0–3 months"
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={currentIndex > 0 ? () => setCurrentIndex((prev) => prev - 1) : undefined}
        onExit={onExit}
      />

      {/* Single Activity Screen */}
      <AssessmentActivity
        activity={currentActivity}
        patientId={patient?.id}
        selectedRange={activeSavedRange}
        onRangeChange={handleSelectedRangeChange}
        onSubmit={handleActivitySubmit}
        isParentRole={role === 'parent'}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
