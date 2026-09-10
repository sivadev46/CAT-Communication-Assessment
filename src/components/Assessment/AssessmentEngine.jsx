import React, { useState, useEffect } from 'react';
import AssessmentHeader from './AssessmentHeader';
import AssessmentActivity from './AssessmentActivity';
import { catSupabaseService } from '../../services/catSupabase';
import { Award, RotateCcw, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AssessmentEngine({
  patient,
  role = 'therapist', // 'therapist' | 'parent'
  onComplete,
  onExit,
}) {
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [activities, setActivities] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [session, setSession] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Load Module, Activities, Session & Responses from Supabase
  useEffect(() => {
    let isMounted = true;
    const initAssessmentData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Published Modules
        const mods = await catSupabaseService.getPublishedModules();
        if (!isMounted) return;
        setModules(mods);

        const currentMod = mods[0] || null;
        setActiveModule(currentMod);

        if (currentMod) {
          // 2. Fetch Activities for Module
          const acts = await catSupabaseService.getModuleActivities(currentMod.id);
          if (!isMounted) return;
          setActivities(acts);

          if (patient?.id) {
            // 3. Get or Create Session
            const sess = await catSupabaseService.getOrCreateSession(patient.id, currentMod.id, role);
            if (!isMounted) return;
            setSession(sess);

            // 4. Fetch Previous Saved Responses
            const savedResps = await catSupabaseService.getPatientResponses(patient.id, sess?.id);
            if (!isMounted) return;
            setResponses(savedResps);

            // 5. Resume step position
            if (sess?.current_activity_number && acts.length > 0) {
              const resIndex = Math.min(sess.current_activity_number - 1, acts.length - 1);
              setCurrentIndex(Math.max(0, resIndex));
            }
          }
        }
      } catch (err) {
        console.error('Error initializing assessment engine:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAssessmentData();
    return () => {
      isMounted = false;
    };
  }, [patient?.id, role]);

  const currentActivity = activities[currentIndex] || null;
  const currentStep = currentIndex + 1;
  const totalSteps = activities.length;

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

    const isParent = role === 'parent';
    const reviewStatus = isParent ? 'pending_review' : 'approved';
    const isOfficial = !isParent;

    const newResponseItem = {
      selectedRange: activityResult.selectedRange,
      videoSubmission: activityResult.videoSubmission || null,
      performedByRole: role,
      reviewStatus,
      isOfficial,
      submittedAt: new Date().toISOString(),
    };

    const updatedResponses = {
      ...responses,
      [activityResult.activityId]: newResponseItem,
    };

    setResponses(updatedResponses);

    // Save Response to Supabase
    try {
      if (patient?.id) {
        await catSupabaseService.saveActivityResponse({
          sessionId: session?.id,
          patientId: patient.id,
          activityId: activityResult.activityId,
          selectedRange: activityResult.selectedRange,
          performedByRole: role,
          videoSubmissionId: activityResult.videoSubmission?.id || null,
          reviewStatus,
          isOfficial,
        });

        // Persist local state backup for instant resume
        localStorage.setItem(`cat_assessment_step_${patient.id}`, (currentIndex + 2).toString());
        localStorage.setItem(`cat_assessment_responses_${patient.id}`, JSON.stringify(updatedResponses));
      }
    } catch (err) {
      console.error('Error saving response:', err);
    } finally {
      setIsSubmitting(false);
    }

    // Move to next activity or complete assessment
    if (currentIndex + 1 < totalSteps) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      if (session?.id) {
        catSupabaseService.updateSessionStep(session.id, nextIndex + 1, 'in_progress');
      }
    } else {
      setIsFinished(true);
      if (session?.id) {
        catSupabaseService.updateSessionStep(session.id, totalSteps, 'completed');
      }
      if (onComplete) {
        onComplete(updatedResponses);
      }
    }
  };

  const handlePreviousActivity = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      if (session?.id) {
        catSupabaseService.updateSessionStep(session.id, prevIndex + 1, 'in_progress');
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-[#121218] rounded-2xl border border-[#27273A] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#FFE600] mx-auto" />
        <p className="text-sm font-semibold text-gray-300">
          Loading published assessment module and activities...
        </p>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center bg-[#121218] rounded-2xl border border-[#27273A] space-y-4">
        <AlertCircle className="w-12 h-12 text-[#FFE600] mx-auto" />
        <h3 className="text-xl font-bold text-white">No Assessment Available</h3>
        <p className="text-sm text-gray-400">
          No assessment modules have been published yet. Please ask your administrator to create and publish modules.
        </p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center bg-[#121218] rounded-2xl border border-[#27273A] space-y-4">
        <AlertCircle className="w-12 h-12 text-[#FFE600] mx-auto" />
        <h3 className="text-xl font-bold text-white">No Activities Available</h3>
        <p className="text-sm text-gray-400">
          No activities available in this module yet. Please ask your administrator to populate activities.
        </p>
      </div>
    );
  }

  // FINISHED STATE
  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center space-y-6 bg-[#121218] border border-[#27273A] rounded-2xl shadow-2xl">
        <div className="w-20 h-20 bg-[#FFE600]/20 border border-[#FFE600]/40 rounded-full flex items-center justify-center mx-auto text-[#FFE600] shadow-lg">
          <Award className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          {activeModule?.name || 'Module 1'} Assessment Completed!
        </h2>
        <p className="text-sm sm:text-base text-gray-300 max-w-md mx-auto leading-relaxed">
          {role === 'parent'
            ? 'Thank you! Your assessment responses and recorded video sessions have been submitted and are pending therapist review.'
            : 'All activities have been evaluated. Official patient progress and report metrics have been updated.'}
        </p>

        <div className="p-4 bg-[#1A1A24] rounded-2xl border border-[#27273A] text-left max-w-md mx-auto space-y-2.5 text-xs text-gray-300">
          <div className="flex justify-between">
            <span className="text-gray-400">Patient Name:</span>
            <strong className="font-bold text-white">{patient?.full_name || patient?.fullName || patient?.name}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Patient ID Code:</span>
            <strong className="font-mono text-[#FFE600]">{patient?.patient_id_code || patient?.patientId || 'CAT-2026-00124'}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Evaluated Activities:</span>
            <strong className="font-bold text-[#FFE600]">{totalSteps} / {totalSteps}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Status:</span>
            <strong className="font-bold text-[#FFE600]">
              {role === 'parent' ? 'Submitted (Pending Review)' : 'Official Assessment Logged'}
            </strong>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={handleResetAssessment}
            className="px-5 py-2.5 rounded-xl border border-[#27273A] bg-[#1A1A24] hover:bg-[#27273A] text-gray-200 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Assessment
          </button>
          <button
            type="button"
            onClick={() => navigate(role === 'parent' ? '/parent-dashboard' : '/reports')}
            className="px-6 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] text-black font-extrabold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
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
    <div className="max-w-4xl mx-auto space-y-4 pb-6">
      {/* 1, 2, 3: Assessment Header (Tool Title, Module Name, Activity Name, Completion Progress) */}
      <AssessmentHeader
        moduleName={activeModule?.name || 'Pre-Intentional Communication Tool'}
        activityTitle={currentActivity?.title || ''}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={currentIndex > 0 ? handlePreviousActivity : undefined}
        onExit={onExit}
      />

      {/* Single Activity Screen (Exact Layout Order) */}
      <AssessmentActivity
        activity={currentActivity}
        moduleName={activeModule?.name || 'Pre-Intentional Communication Tool'}
        patientId={patient?.id}
        selectedRange={activeSavedRange}
        onRangeChange={handleSelectedRangeChange}
        onSubmit={handleActivitySubmit}
        onPrevious={handlePreviousActivity}
        isFirstStep={currentIndex === 0}
        isLastStep={currentIndex === totalSteps - 1}
        isParentRole={role === 'parent'}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
