# NIEPMD Communication Assessment Tool (CAT)

A pilot-ready Communication Assessment Tool developed for NIEPMD (National Institute for Empowerment of Persons with Multiple Disabilities).

---

## Key Features

- **Module 1: Pre-Intentional Communication Tool (0–3 Months)**: Contains 21 guided clinical activities with NIEPMD activity images, goals, instructions, parent tips, and instructional videos.
- **Unified Reusable Assessment Engine**: Both Therapist and Parent roles work with the exact same assessment data and database structure.
- **Parent Session Video Recording & Therapist Review**: Parents can record at-home activity sessions using browser camera/microphone. Submissions start with `PENDING_REVIEW` status and do NOT alter official clinical progress until reviewed and approved by the assigned therapist.
- **Dynamic Age Calculation**: Dynamic exact age calculation (`years, months, days`) from Date of Birth (DOB) with restricted gender options (`Male`, `Female`, `Others`).
- **AI-Assisted Report Summary**: Server-side Gemini API integration generating structured clinical summaries with the mandatory disclaimer: `"AI-Assisted Draft — Requires Clinician Review"` and non-diagnostic constraints.
- **Formatted PDF Reports**: Export clinical reports using `jsPDF`.
- **Admin Portal**: Complete module management (publish/lock modules), activity management (add/edit activities with Supabase Storage media uploads), and user management (therapists, parents, patient links).
- **Supabase Backend**: Built on Supabase PostgreSQL, Supabase Auth, and Supabase Storage with Row Level Security (RLS) policies.

---

## Getting Started Locally

### 1. Prerequisites
- Node.js (v18+)
- npm or bun

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your values in `.env`:
```env
# Frontend Supabase Credentials
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Server-side Gemini API Key
GEMINI_API_KEY="your-gemini-api-key"
```

---

## Database Setup (Supabase)

1. Open your **Supabase Dashboard** -> **SQL Editor**.
2. Run `supabase/schema.sql` to create all PostgreSQL tables, indexes, constraints, and Row Level Security (RLS) policies:
   ```sql
   -- Run contents of supabase/schema.sql
   ```
3. Run `supabase/seed.sql` to populate **Module 1 (21 Activities)** and lock definitions for Modules 2–8:
   ```sql
   -- Run contents of supabase/seed.sql
   ```
4. Create Supabase Storage Buckets in **Storage** -> **New Bucket**:
   - `assessment-media` (Public bucket for activity images and instructional videos)
   - `parent-sessions` (Authenticated bucket for parent-recorded session videos)

---

## Running the Application

### Development Mode (Express + Vite)
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Type Check
```bash
npm run lint
```

### Production Build
```bash
npm run build
```

---

## Netlify Deployment

1. Connect your repository to Netlify.
2. Build Settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Environment Variables in Netlify Dashboard (**Site Settings** -> **Environment variables**):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
4. Netlify will serve the frontend SPA from `dist` and process serverless API calls (including `netlify/functions/gemini.js`).

---

## Roles & Access Control

- **ADMIN**: Access `/admin-dashboard`, `/admin-modules`, `/admin-activities`, `/admin-users`.
- **THERAPIST**: Access `/dashboard`, `/patients`, `/assessment`, `/reports`. Review parent-recorded session videos (`Approve` / `Reject`).
- **PARENT**: Access `/parent-dashboard` (linked child info), `/assessment` (with optional session video recording), `/reports`.

---

## Technical Support & Notes
- Gemini API key is kept strictly server-side (`GEMINI_API_KEY`).
- Parent responses remain `pending_review` until approved by the therapist.
