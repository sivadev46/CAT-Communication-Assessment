# Communication Assessment Tool (CAT)

Official **Communication Assessment Tool (CAT)** web application developed for **NIEPMD** (National Institute for Empowerment of Persons with Multiple Disabilities - Divyangjan) by **Rajalakshmi Engineering College**.

The system provides a unified, database-driven clinical assessment engine for speech-language pathologists (therapists) and caregivers (parents), featuring parent video recordings, therapist video review workflows, dynamic admin module/activity management, Gemini AI clinical report summarization, and PDF report generation.

---

## Technical Stack & Architecture

- **Frontend**: React 19, Vite, React Router 7, TailwindCSS (Dark High-Contrast Theme)
- **Backend / Database**: Supabase (PostgreSQL, Authentication, Row-Level Security, Realtime, Storage)
- **AI Integration**: Gemini API (`gemini-2.5-flash`)
- **PDF Generation**: jsPDF
- **Deployment**: Netlify (Vite SPA deployment with `_redirects` routing)

---

## Quick Start & Local Setup

### 1. Clone & Install Dependencies
```bash
cd CAT-Communication-Assessment
npm install
```

### 2. Supabase Project Setup
1. Go to [Supabase Console](https://supabase.com) and create a new project.
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Copy the contents of `supabase/schema.sql` and run the script to create all tables, indexes, and RLS policies.
4. Copy the contents of `supabase/seed.sql` and run the script to populate **Module 1 (Pre-Intentional Communication Tool, 0–3 months)** and all **21 activities**.

### 3. Create Storage Buckets
In the Supabase Dashboard under **Storage**:
- Create a public bucket named `assessment-media` (for activity images).
- Create a private bucket named `parent-sessions` (for parent-recorded session videos).

### 4. Configure Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
```

### 5. Run Locally
```bash
npm run dev
```

---

## Production Build & Netlify Deployment

### 1. Build Verification
```bash
npm run build
```

### 2. Deploy to Netlify
1. Connect your repository to Netlify.
2. Build Settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Environment Variables in Netlify Dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
4. The included `public/_redirects` and `netlify.toml` automatically handle SPA routing (`/* /index.html 200`).

---

## User Workflows & Instructions

### A. Admin Content Creation
1. Log in to the Admin Portal (`/admin-modules`).
2. Create/Edit Module: set Module Name (e.g. "Pre-Intentional Communication Tool") and Age Range ("0–3 months").
3. Go to `/admin-activities` -> Click **+ Add Activity**.
4. Upload activity demonstration image (saved to Supabase `assessment-media`).
5. Paste YouTube demonstration URL.
6. Publish Module: the assessment engine dynamically loads and renders content directly from Supabase!

### B. Therapist & Patient Workflow
1. Therapist logs in -> Goes to **Patients** -> Clicks **Add New Patient**.
2. Enters Patient Name, Date of Birth (DOB date picker), and Gender.
3. System automatically generates a unique Patient ID code (e.g. `CAT-2026-00124`) and calculates exact dynamic age (e.g., "3 months 19 days").
4. Therapist starts assessment using the **Shared Assessment Engine**.
5. Selects responses (`0–25%`, `25–50%`, `50–80%`, `80–100%`) and submits. Response becomes official immediately.

### C. Parent Registration & Video Review Workflow
1. Parent registers via **Parent Login** -> Enters Name, Email, Password, and **Ward / Patient ID** (e.g. `CAT-2026-00124` provided by therapist).
2. System validates Patient ID against Supabase. Upon verification, parent profile is linked to child record.
3. Parent opens assessment on the same Shared Assessment Engine -> Selects scale -> Optionally records session video using browser camera -> Submits.
4. Submission enters `PENDING_REVIEW` status. Official report metrics do NOT update until approved by therapist.
5. Therapist opens **Parent Video Reviews** -> Watches video -> Clicks **Approve** (updates official progress) or **Reject**.
6. Safe deletion allows deleting stored video files without touching patient or assessment response data.

### D. Reports & Gemini AI Summarizer
1. Open **Reports** page.
2. Click **Generate AI Summary**: calls Gemini API to summarize responses with disclaimer:
   > *"AI-ASSISTED REPORT SUMMARY - AI-assisted draft. Requires clinician review."*
3. Click **Export PDF**: generates clinical report including Patient ID, DOB, Dynamic Age, Gender, Responses, Video Approval status, and Clinician info.

---

## Credits & Attribution

- **Organization**: NIEPMD (National Institute for Empowerment of Persons with Multiple Disabilities - Divyangjan)
- **Institution**: Rajalakshmi Engineering College
