-- ============================================================
-- NIEPMD Communication Assessment Tool (CAT)
-- Production Supabase Database Schema
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked to Supabase Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'therapist', 'parent')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. THERAPISTS TABLE
CREATE TABLE IF NOT EXISTS public.therapists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  license_number TEXT,
  specialization TEXT DEFAULT 'Speech-Language Pathologist',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PARENTS TABLE
CREATE TABLE IF NOT EXISTS public.parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id_code TEXT UNIQUE NOT NULL, -- e.g. CAT-2026-00124
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Others')),
  created_by_therapist_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. PATIENT-PARENT LINKS TABLE
CREATE TABLE IF NOT EXISTS public.patient_parent_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES public.parents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_patient_parent UNIQUE (patient_id, parent_id)
);

-- 6. THERAPIST-PATIENT LINKS TABLE
CREATE TABLE IF NOT EXISTS public.therapist_patient_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_therapist_patient UNIQUE (therapist_id, patient_id)
);

-- 7. ASSESSMENT MODULES TABLE
CREATE TABLE IF NOT EXISTS public.assessment_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_number INT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT,
  age_range TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'locked', 'draft')),
  display_order INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. ASSESSMENT ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS public.assessment_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.assessment_modules(id) ON DELETE CASCADE,
  activity_number INT NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  instruction TEXT,
  goal TEXT,
  parent_tips JSONB DEFAULT '[]'::jsonb,
  things_to_remember JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  video_url TEXT,
  display_order INT NOT NULL,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_module_activity UNIQUE (module_id, activity_number)
);

-- 9. ASSESSMENT SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.assessment_modules(id) ON DELETE CASCADE,
  conducted_by_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  conducted_by_role TEXT CHECK (conducted_by_role IN ('therapist', 'parent')),
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  current_activity_number INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. PARENT VIDEO SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.parent_video_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES public.assessment_activities(id) ON DELETE CASCADE,
  parent_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_path TEXT NOT NULL,
  video_url TEXT,
  duration_seconds INT DEFAULT 0,
  selected_range TEXT CHECK (selected_range IN ('0-25', '25-50', '50-80', '80-100')),
  review_status TEXT DEFAULT 'pending_review' CHECK (review_status IN ('pending_review', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. ASSESSMENT RESPONSES TABLE
CREATE TABLE IF NOT EXISTS public.assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.assessment_sessions(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES public.assessment_activities(id) ON DELETE CASCADE,
  selected_range TEXT NOT NULL CHECK (selected_range IN ('0-25', '25-50', '50-80', '80-100')),
  performed_by_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  performed_by_role TEXT NOT NULL CHECK (performed_by_role IN ('therapist', 'parent')),
  video_submission_id UUID REFERENCES public.parent_video_submissions(id) ON DELETE SET NULL,
  review_status TEXT DEFAULT 'approved' CHECK (review_status IN ('approved', 'pending_review', 'rejected')),
  is_official BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 12. VIDEO REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.video_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.parent_video_submissions(id) ON DELETE CASCADE,
  reviewer_therapist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('approved', 'rejected')),
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ DEFAULT now()
);

-- 13. PATIENT PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.patient_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.assessment_modules(id) ON DELETE CASCADE,
  completed_activities_count INT DEFAULT 0,
  total_activities_count INT DEFAULT 21,
  completion_percentage NUMERIC(5,2) DEFAULT 0.00,
  is_module_completed BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_patient_module_progress UNIQUE (patient_id, module_id)
);

-- 14. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.assessment_sessions(id) ON DELETE SET NULL,
  module_id UUID REFERENCES public.assessment_modules(id) ON DELETE SET NULL,
  therapist_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  clinical_summary TEXT,
  caregiver_summary TEXT,
  home_strategies JSONB DEFAULT '[]'::jsonb,
  strengths JSONB DEFAULT '[]'::jsonb,
  areas_for_improvement JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  risk_level TEXT CHECK (risk_level IN ('Low', 'Medium', 'High')),
  pdf_path TEXT,
  generated_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_patients_code ON public.patients(patient_id_code);
CREATE INDEX IF NOT EXISTS idx_activities_module ON public.assessment_activities(module_id, display_order);
CREATE INDEX IF NOT EXISTS idx_responses_session ON public.assessment_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_responses_patient ON public.assessment_responses(patient_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.parent_video_submissions(review_status);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_parent_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_patient_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_video_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Modules and Activities are readable by all authenticated users
CREATE POLICY "Public read modules" ON public.assessment_modules FOR SELECT USING (true);
CREATE POLICY "Public read activities" ON public.assessment_activities FOR SELECT USING (true);

-- Admin can manage modules and activities
CREATE POLICY "Admin full access modules" ON public.assessment_modules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full access activities" ON public.assessment_activities FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Profiles policy
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Patient Access Policies
CREATE POLICY "Therapist view assigned patients" ON public.patients FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'therapist' OR role = 'admin'))
);
CREATE POLICY "Parent view linked child" ON public.patients FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.patient_parent_links ppl
    JOIN public.parents p ON ppl.parent_id = p.id
    WHERE ppl.patient_id = patients.id AND p.profile_id = auth.uid()
  )
);
CREATE POLICY "Therapist insert patients" ON public.patients FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'therapist' OR role = 'admin'))
);

-- Assessment Sessions Policies
CREATE POLICY "Users view relevant sessions" ON public.assessment_sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'therapist' OR role = 'admin'))
  OR
  EXISTS (
    SELECT 1 FROM public.patient_parent_links ppl
    JOIN public.parents p ON ppl.parent_id = p.id
    WHERE ppl.patient_id = assessment_sessions.patient_id AND p.profile_id = auth.uid()
  )
);
CREATE POLICY "Users create sessions" ON public.assessment_sessions FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);
CREATE POLICY "Users update sessions" ON public.assessment_sessions FOR UPDATE USING (
  auth.uid() IS NOT NULL
);

-- Assessment Responses Policies
CREATE POLICY "Therapists view responses" ON public.assessment_responses FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'therapist' OR role = 'admin'))
  OR
  EXISTS (
    SELECT 1 FROM public.patient_parent_links ppl
    JOIN public.parents p ON ppl.parent_id = p.id
    WHERE ppl.patient_id = assessment_responses.patient_id AND p.profile_id = auth.uid()
  )
);
CREATE POLICY "Users insert responses" ON public.assessment_responses FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);
CREATE POLICY "Therapists update responses" ON public.assessment_responses FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'therapist' OR role = 'admin'))
);

-- Parent Video Submissions Policies
CREATE POLICY "View video submissions" ON public.parent_video_submissions FOR SELECT USING (
  parent_profile_id = auth.uid()
  OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'therapist' OR role = 'admin'))
);
CREATE POLICY "Insert video submissions" ON public.parent_video_submissions FOR INSERT WITH CHECK (
  parent_profile_id = auth.uid()
);
CREATE POLICY "Therapist update video submissions" ON public.parent_video_submissions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'therapist' OR role = 'admin'))
);
CREATE POLICY "Delete video submissions" ON public.parent_video_submissions FOR DELETE USING (
  parent_profile_id = auth.uid()
  OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'therapist' OR role = 'admin'))
);

-- Patient Progress Policies
CREATE POLICY "View progress" ON public.patient_progress FOR SELECT USING (true);
CREATE POLICY "Update progress" ON public.patient_progress FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'therapist' OR role = 'admin'))
);

-- Reports Policies
CREATE POLICY "View reports" ON public.reports FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'therapist' OR role = 'admin'))
  OR
  EXISTS (
    SELECT 1 FROM public.patient_parent_links ppl
    JOIN public.parents p ON ppl.parent_id = p.id
    WHERE ppl.patient_id = reports.patient_id AND p.profile_id = auth.uid()
  )
);
CREATE POLICY "Create reports" ON public.reports FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'therapist' OR role = 'admin'))
);

-- ============================================================
-- STORAGE BUCKETS SETUP & STORAGE RLS POLICIES
-- ============================================================

-- Create buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('assessment-media', 'assessment-media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('parent-sessions', 'parent-sessions', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for assessment-media (Public read, admin write)
CREATE POLICY "Assessment media public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'assessment-media');

CREATE POLICY "Assessment media admin upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'assessment-media' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Storage Policies for parent-sessions (Authenticated read/write for owner, therapist, admin)
CREATE POLICY "Parent session upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'parent-sessions' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Parent session view" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'parent-sessions' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Parent session delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'parent-sessions' AND
    auth.uid() IS NOT NULL
  );

