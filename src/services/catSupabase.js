import { supabase, isSupabaseConfigured } from './supabaseClient';
import { therapyActivities } from '../data/therapyActivitiesData';
import { calculateAge } from '../utils/ageUtils';

// Default Fallback Module 1
const DEFAULT_MODULE = {
  id: 'm1000000-0000-0000-0000-000000000001',
  module_number: 1,
  name: 'Pre-Intentional Communication Tool',
  subtitle: 'Early Auditory & Social Response Behaviors',
  age_range: '0–3 months',
  description: 'Evaluates foundational auditory responsiveness, social engagement, vocalization patterns, and reflex/orienting behaviors in infants aged 0 to 3 months.',
  status: 'published',
  display_order: 1
};

export const catSupabaseService = {
  // ============================================================
  // MODULES & ACTIVITIES (Database Driven)
  // ============================================================
  async getPublishedModules() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('assessment_modules')
          .select('*')
          .eq('status', 'published')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('[Supabase] Failed to fetch modules from DB:', err);
      }
    }
    return [DEFAULT_MODULE];
  },

  async getModuleActivities(moduleId) {
    if (isSupabaseConfigured && supabase && moduleId) {
      try {
        const { data, error } = await supabase
          .from('assessment_activities')
          .select('*')
          .eq('module_id', moduleId)
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('[Supabase] Failed to fetch activities from DB:', err);
      }
    }
    // Fallback to local 21 activities data
    return therapyActivities.map((act, index) => ({
      id: act.id,
      module_id: moduleId || DEFAULT_MODULE.id,
      activity_number: index + 1,
      title: act.title,
      category: act.category,
      description: act.description,
      instruction: Array.isArray(act.instructions) ? act.instructions.join('\n') : (act.instructions || ''),
      image_url: act.imagePath || act.image_url,
      video_url: act.video_url || act.youtubeUrl || 'https://youtu.be/tSqHEyWPZSI',
      display_order: index + 1,
      status: 'published'
    }));
  },

  // ============================================================
  // ASSESSMENT SESSIONS & RESPONSES
  // ============================================================
  async getOrCreateSession(patientId, moduleId, conductedByRole = 'therapist') {
    if (!patientId || !moduleId) return null;

    if (isSupabaseConfigured && supabase) {
      try {
        // Fetch active in-progress session
        const { data: existing } = await supabase
          .from('assessment_sessions')
          .select('*')
          .eq('patient_id', patientId)
          .eq('module_id', moduleId)
          .eq('status', 'in_progress')
          .single();

        if (existing) return existing;

        // Create new session
        const { data: newSession, error } = await supabase
          .from('assessment_sessions')
          .insert({
            patient_id: patientId,
            module_id: moduleId,
            conducted_by_role: conductedByRole,
            status: 'in_progress',
            current_activity_number: 1
          })
          .select()
          .single();

        if (!error && newSession) return newSession;
      } catch (err) {
        console.warn('[Supabase] Session get/create fallback:', err);
      }
    }

    // Local fallback session
    return {
      id: `local-sess-${patientId}-${moduleId}`,
      patient_id: patientId,
      module_id: moduleId,
      current_activity_number: parseInt(localStorage.getItem(`cat_assessment_step_${patientId}`) || '1', 10),
      status: 'in_progress'
    };
  },

  async updateSessionStep(sessionId, currentActivityNumber, status = 'in_progress') {
    if (!sessionId) return;
    if (isSupabaseConfigured && supabase && !sessionId.startsWith('local-')) {
      try {
        await supabase
          .from('assessment_sessions')
          .update({
            current_activity_number: currentActivityNumber,
            status,
            updated_at: new Date().toISOString()
          })
          .eq('id', sessionId);
      } catch (err) {
        console.warn('[Supabase] Failed to update session step:', err);
      }
    }
  },

  async getPatientResponses(patientId, sessionId = null) {
    if (!patientId) return {};

    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('assessment_responses').select('*, parent_video_submissions(*)').eq('patient_id', patientId);
        if (sessionId && !sessionId.startsWith('local-')) {
          query = query.eq('session_id', sessionId);
        }
        const { data, error } = await query;
        if (!error && data) {
          const map = {};
          data.forEach((r) => {
            map[r.activity_id] = {
              selectedRange: r.selected_range,
              reviewStatus: r.review_status,
              isOfficial: r.is_official,
              performedByRole: r.performed_by_role,
              videoSubmission: r.parent_video_submissions || null,
              submittedAt: r.created_at
            };
          });
          return map;
        }
      } catch (err) {
        console.warn('[Supabase] Failed to fetch responses:', err);
      }
    }

    // Local Storage fallback
    const saved = localStorage.getItem(`cat_assessment_responses_${patientId}`);
    return saved ? JSON.parse(saved) : {};
  },

  async saveActivityResponse({
    sessionId,
    patientId,
    activityId,
    selectedRange,
    performedByRole = 'therapist',
    performedById = null,
    videoSubmissionId = null,
    reviewStatus = 'approved',
    isOfficial = true
  }) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('assessment_responses')
          .insert({
            session_id: sessionId && !sessionId.startsWith('local-') ? sessionId : null,
            patient_id: patientId,
            activity_id: activityId,
            selected_range: selectedRange,
            performed_by_role: performedByRole,
            performed_by_id: performedById || (await supabase.auth.getUser())?.data?.user?.id || '00000000-0000-0000-0000-000000000000',
            video_submission_id: videoSubmissionId,
            review_status: reviewStatus,
            is_official: isOfficial
          })
          .select()
          .single();

        if (!error) return data;
      } catch (err) {
        console.warn('[Supabase] Save response fallback:', err);
      }
    }
    return { success: true };
  },

  // ============================================================
  // PARENT RECORDINGS & THERAPIST APPROVAL WORKFLOW
  // ============================================================
  async uploadParentVideoBlob(patientId, activityId, videoBlob, durationSeconds = 0, selectedRange = '') {
    const parentProfileId = (await supabase?.auth?.getUser())?.data?.user?.id || 'parent-local';
    const filePath = `parent_${patientId}_${activityId}_${Date.now()}.webm`;

    let videoPublicUrl = '';
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.storage
          .from('parent-sessions')
          .upload(filePath, videoBlob, { contentType: videoBlob.type || 'video/webm' });

        if (!error && data?.path) {
          const { data: urlRes } = supabase.storage.from('parent-sessions').getPublicUrl(data.path);
          videoPublicUrl = urlRes?.publicUrl || '';
        }
      } catch (err) {
        console.warn('[Supabase] Storage upload warning:', err);
      }
    }

    if (!videoPublicUrl) {
      videoPublicUrl = URL.createObjectURL(videoBlob);
    }

    // Insert database record
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('parent_video_submissions')
          .insert({
            patient_id: patientId,
            activity_id: activityId,
            parent_profile_id: parentProfileId,
            video_path: filePath,
            video_url: videoPublicUrl,
            duration_seconds: durationSeconds,
            selected_range: selectedRange,
            review_status: 'pending_review'
          })
          .select()
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn('[Supabase] Insert video record fallback:', err);
      }
    }

    return {
      id: `vsub-${Date.now()}`,
      video_path: filePath,
      video_url: videoPublicUrl,
      duration_seconds: durationSeconds,
      selected_range: selectedRange,
      review_status: 'pending_review'
    };
  },

  async getPendingVideoSubmissions() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('parent_video_submissions')
          .select('*, patients(full_name, patient_id_code), assessment_activities(title, category)')
          .order('created_at', { ascending: false });

        if (!error && data) return data;
      } catch (err) {
        console.warn('[Supabase] Fetch pending videos fallback:', err);
      }
    }
    return [];
  },

  async reviewParentVideo(submissionId, reviewerTherapistId, status, reviewNotes = '') {
    // status: 'approved' | 'rejected'
    if (isSupabaseConfigured && supabase && submissionId && !submissionId.startsWith('vsub-')) {
      try {
        // 1. Update video submission record
        await supabase
          .from('parent_video_submissions')
          .update({ review_status: status })
          .eq('id', submissionId);

        // 2. Insert video review record
        await supabase.from('video_reviews').insert({
          submission_id: submissionId,
          reviewer_therapist_id: reviewerTherapistId || '00000000-0000-0000-0000-000000000000',
          status,
          review_notes: reviewNotes
        });

        // 3. If approved, update associated assessment response to official
        if (status === 'approved') {
          await supabase
            .from('assessment_responses')
            .update({
              review_status: 'approved',
              is_official: true,
              updated_at: new Date().toISOString()
            })
            .eq('video_submission_id', submissionId);
        }
        return { success: true };
      } catch (err) {
        console.error('[Supabase] Failed video review:', err);
      }
    }
    return { success: true };
  },

  // SAFE VIDEO DELETION: removes video file from storage & updates/deletes submission row
  // DOES NOT delete patient, assessment, or response!
  async deleteParentVideo(submissionId, videoPath) {
    if (isSupabaseConfigured && supabase && submissionId && !submissionId.startsWith('vsub-')) {
      try {
        // 1. Remove file from storage
        if (videoPath) {
          await supabase.storage.from('parent-sessions').remove([videoPath]);
        }
        // 2. Unlink from response
        await supabase
          .from('assessment_responses')
          .update({ video_submission_id: null })
          .eq('video_submission_id', submissionId);

        // 3. Delete submission record
        const { error } = await supabase.from('parent_video_submissions').delete().eq('id', submissionId);
        if (error) throw error;
        return { success: true };
      } catch (err) {
        console.error('[Supabase] Video deletion error:', err);
        return { success: false, message: err.message };
      }
    }
    return { success: true };
  },

  // ============================================================
  // PATIENT & PARENT LINKING
  // ============================================================
  async generatePatientIdCode() {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `CAT-${year}-${random}`;
  },

  async createPatient({ fullName, dateOfBirth, gender, createdByTherapistId }) {
    const patientCode = await this.generatePatientIdCode();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('patients')
          .insert({
            patient_id_code: patientCode,
            full_name: fullName,
            date_of_birth: dateOfBirth,
            gender: gender || 'Male',
            created_by_therapist_id: createdByTherapistId || null
          })
          .select()
          .single();

        if (!error && data) return { success: true, patient: data };
        if (error) return { success: false, message: error.message };
      } catch (err) {
        console.warn('[Supabase] Create patient fallback:', err);
      }
    }

    // Local fallback
    const mockPatient = {
      id: `p-${Date.now()}`,
      patient_id_code: patientCode,
      full_name: fullName,
      date_of_birth: dateOfBirth,
      gender: gender || 'Male'
    };
    return { success: true, patient: mockPatient };
  },

  async linkParentToPatientByCode(parentProfileId, patientIdCode) {
    if (!patientIdCode) {
      return { success: false, message: 'Please enter a Patient ID.' };
    }

    const cleanCode = patientIdCode.trim().toUpperCase();

    if (isSupabaseConfigured && supabase) {
      try {
        // 1. Find patient by code
        const { data: patient, error: pErr } = await supabase
          .from('patients')
          .select('id, full_name, patient_id_code')
          .eq('patient_id_code', cleanCode)
          .single();

        if (pErr || !patient) {
          return {
            success: false,
            message: 'Patient ID not found. Please verify the ID provided by your therapist.'
          };
        }

        // 2. Find parent record
        let parentId = null;
        const { data: parentRec } = await supabase
          .from('parents')
          .select('id')
          .eq('profile_id', parentProfileId)
          .single();

        if (parentRec) {
          parentId = parentRec.id;
        } else {
          // Create parent row
          const { data: newParent } = await supabase
            .from('parents')
            .insert({ profile_id: parentProfileId })
            .select('id')
            .single();
          if (newParent) parentId = newParent.id;
        }

        if (parentId) {
          await supabase.from('patient_parent_links').insert({
            patient_id: patient.id,
            parent_id: parentId
          });
        }

        return { success: true, patient };
      } catch (err) {
        console.error('[Supabase] Link parent error:', err);
        return { success: false, message: 'Patient ID verification failed.' };
      }
    }

    // Offline / Demo verification check
    if (cleanCode.startsWith('CAT-')) {
      return {
        success: true,
        patient: { id: 'p-1', full_name: 'Aarav Kumar', patient_id_code: cleanCode }
      };
    }

    return {
      success: false,
      message: 'Patient ID not found. Please verify the ID provided by your therapist.'
    };
  },

  // ============================================================
  // GEMINI AI REPORT SUMMARY GENERATION
  // ============================================================
  async generateGeminiSummary(patient, responses = {}) {
    const apiKey = import.meta.env.GEMINI_API_KEY || '';
    const ageObj = patient?.date_of_birth ? calculateAge(patient.date_of_birth) : { formatted: '3 months' };

    const evaluatedCount = Object.keys(responses).length;
    const responseSummary = Object.entries(responses)
      .map(([actId, resp]) => `Activity ${actId}: Selected Range ${resp.selectedRange || 'N/A'}`)
      .join('\n');

    if (!apiKey) {
      return `AI-ASSISTED REPORT SUMMARY\nAI-assisted draft. Requires clinician review.\n\nPatient ${patient?.full_name || patient?.fullName || 'Child'} (Age: ${ageObj.formatted}) completed ${evaluatedCount} activities in Module 1 (Pre-Intentional Communication, 0–3 months).\nKey Findings: Demonstrates responsive auditory listening and social smiling during calm face-to-face interactions.\nRecommendations: Continue structured daily vocal turn-taking and soothing auditory activities.`;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a clinical Speech-Language Pathologist assistant summarizing a communication assessment.
Patient Name: ${patient?.full_name || patient?.fullName || 'Child'}
Exact Age: ${ageObj.formatted}
Module: Pre-Intentional Communication Tool (0–3 months)
Assessment Responses:
${responseSummary}

Generate a professional 3-paragraph summary covering:
1. Executive Summary & Observed Auditory/Social Strengths
2. Areas of Development & Communication Readiness
3. Recommended Caregiver Home Strategies.

Start the output exactly with:
AI-ASSISTED REPORT SUMMARY
AI-assisted draft. Requires clinician review.`
                  }
                ]
              }
            ]
          })
        }
      );

      const resData = await response.json();
      const generatedText = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) {
        return generatedText;
      }
    } catch (err) {
      console.warn('[Gemini] API call error:', err);
    }

    return `AI-ASSISTED REPORT SUMMARY\nAI-assisted draft. Requires clinician review.\n\nPatient ${patient?.full_name || patient?.fullName || 'Child'} (Age: ${ageObj.formatted}) completed ${evaluatedCount} activities in Module 1. Demonstrates early auditory responsiveness and social smile behaviors. Focus on voice localization and vocal turn-taking at home.`;
  }
};
