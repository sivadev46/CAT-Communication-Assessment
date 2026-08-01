import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Printer,
  Download,
  Share2,
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  PlayCircle,
  BookOpen,
  Music,
  Smile,
  Layers,
  MessageSquare,
  Copy,
  Check,
  X,
  User,
  Calendar,
  Award
} from 'lucide-react';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';
import Modal from '../components/Modal/Modal';
import { activePatientInfo } from '../data/assessmentData';

export default function Caregiver() {
  const navigate = useNavigate();

  const [downloadToast, setDownloadToast] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [videoModal, setVideoModal] = useState({ isOpen: false, title: '' });

  // Friendly rule-based summary statements (no medical jargon)
  const friendlySummary = [
    `Eleanor is showing great progress in listening and responding when people talk to her!`,
    `She understands simple everyday instructions very well and points to objects when asked.`,
    `She is working hard on using words to express her thoughts, and uses hand gestures nicely to help communicate.`,
    `With practice at home, Eleanor will continue to build confidence and strength in her everyday conversations.`
  ];

  // Strengths cards
  const strengthsList = [
    {
      id: 'str-1',
      title: 'Understands Simple Instructions',
      description: 'Listens carefully and follows simple 1-step and 2-step requests reliably at home and in therapy.',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'str-2',
      title: 'Friendly Eye Contact',
      description: 'Makes warm, direct eye contact when greeted by family members, caregivers, and clinicians.',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'str-3',
      title: 'Uses Helpful Gestures',
      description: 'Nods, points, and uses hand movements effectively to show what she needs when words are tricky.',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'str-4',
      title: 'Enjoys Social Interaction',
      description: 'Smiles and stays engaged during turn-taking activities and games.',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
  ];

  // Areas to Practice cards
  const areasToPracticeList = [
    {
      id: 'prac-1',
      title: 'Practicing Word Retrieval',
      description: 'Give Eleanor extra time (10–15 seconds) to find and speak the right word without rushing.',
      iconBg: 'bg-amber-100 text-amber-700',
    },
    {
      id: 'prac-2',
      title: 'Sharing Joint Attention',
      description: 'Encourage looking together at the same book or picture while pointing and naming objects.',
      iconBg: 'bg-amber-100 text-amber-700',
    },
    {
      id: 'prac-3',
      title: 'Building 2-3 Word Sentences',
      description: 'Gently expand single words into short phrases (e.g. if she says "water", model "more water please").',
      iconBg: 'bg-amber-100 text-amber-700',
    },
  ];

  // Home Activities (7 cards)
  const homeActivities = [
    {
      id: 'act-1',
      title: 'Play Imitation Games',
      description: 'Copy expressions, hand signs, or simple sounds back and forth to practice turn-taking.',
      icon: Smile,
      badge: '10 Mins / Day',
      bgColor: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    },
    {
      id: 'act-2',
      title: 'Everyday Object Naming',
      description: 'Point to everyday items during meals or walks (e.g., "cup", "apple", "shoe") and invite her to repeat.',
      icon: Layers,
      badge: 'Daily Routines',
      bgColor: 'bg-blue-50 border-blue-200 text-blue-900',
    },
    {
      id: 'act-3',
      title: 'Storybook Picture Reading',
      description: 'Look through colorful picture books together. Ask simple "Where is the dog?" questions.',
      icon: BookOpen,
      badge: 'Bedtime / Evening',
      bgColor: 'bg-teal-50 border-teal-200 text-teal-900',
    },
    {
      id: 'act-4',
      title: 'Picture & Card Matching',
      description: 'Use photo cards of family members or items to practice matching and naming.',
      icon: Sparkles,
      badge: 'Fun Puzzle',
      bgColor: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    },
    {
      id: 'act-5',
      title: 'Singing Rhymes & Melodies',
      description: 'Sing familiar songs slowly. Pause before the last word to let Eleanor fill in the blank.',
      icon: Music,
      badge: 'Rhythm & Voice',
      bgColor: 'bg-amber-50 border-amber-200 text-amber-900',
    },
    {
      id: 'act-6',
      title: 'Interactive Conversations',
      description: 'Ask choice questions like "Do you want tea or water?" giving visual choices.',
      icon: MessageSquare,
      badge: 'Choice Practice',
      bgColor: 'bg-purple-50 border-purple-200 text-purple-900',
    },
    {
      id: 'act-7',
      title: 'Mirror Speech Warmups',
      description: 'Sit in front of a mirror together and practice smiling, lip rounding, and simple sound fun.',
      icon: Heart,
      badge: 'Oral Motor',
      bgColor: 'bg-rose-50 border-rose-200 text-rose-900',
    },
  ];

  // Teaching Resources
  const teachingResources = [
    {
      id: 'res-1',
      title: 'Articulation Warmup & Speech Exercises',
      description: 'A 5-minute video guide showing gentle mouth warmups and breathing routines for home practice.',
      duration: '5:20 min',
    },
    {
      id: 'res-2',
      title: 'Encouraging Eye Contact & Shared Attention',
      description: 'Practical tips for parents on positioning yourself at eye level during daily conversations.',
      duration: '4:15 min',
    },
    {
      id: 'res-3',
      title: 'Home Turn-Taking & Communication Games',
      description: 'Fun interactive games that build patience, listening skills, and back-and-forth speech.',
      duration: '6:00 min',
    },
  ];

  // Handle Print Action
  const handlePrint = () => {
    window.print();
  };

  // Handle PDF Download action (UI feedback)
  const handleDownloadPDF = () => {
    setDownloadToast(true);
    setTimeout(() => {
      setDownloadToast(false);
    }, 4000);
  };

  // Copy share link
  const handleCopyShareLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-xs print:hidden">
        <div>
          <button
            onClick={() => navigate('/reports')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Clinical Report</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" /> Family & Caregiver Guide
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mt-1">
            Caregiver Report
          </h1>
          <p className="text-xs md:text-sm text-gray-500">
            Understanding your loved one's communication assessment and home activity plan.
          </p>
        </div>

        {/* Action Buttons: Print, PDF, Share */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="text-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-gray-600" />
            <span>Print Report</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="text-xs flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Download PDF</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => setIsShareModalOpen(true)}
            className="text-xs flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Guide</span>
          </Button>
        </div>
      </div>

      {/* Download Notification Toast */}
      {downloadToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-sm shadow-xs print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">
              Preparing Caregiver PDF Guide... File ready for saving.
            </span>
          </div>
          <button onClick={() => setDownloadToast(false)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CAREGIVER REPORT MAIN CONTAINER */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 sm:p-10 space-y-8 print:shadow-none print:border-none print:p-0">
        
        {/* SECTION 1: Patient Information */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-50/60 p-5 rounded-2xl border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg ${activePatientInfo.avatarBg} shadow-xs flex-shrink-0`}>
              {activePatientInfo.initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">{activePatientInfo.name}</h2>
              <p className="text-xs text-gray-600 font-medium mt-0.5">
                Age: <span className="font-semibold text-gray-900">{activePatientInfo.age}</span> • Diagnosis: <span className="font-semibold text-gray-900">{activePatientInfo.diagnosis}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> Evaluation Date: {activePatientInfo.assessmentDate}
              </p>
            </div>
          </div>
          <div className="bg-white px-4 py-2.5 rounded-xl border border-blue-200 text-xs text-center self-start md:self-auto shadow-2xs">
            <p className="text-gray-500 font-medium">Assessed By</p>
            <p className="font-bold text-blue-700">{activePatientInfo.clinician}</p>
          </div>
        </div>

        {/* SECTION 2: Simple Summary */}
        <div>
          <h3 className="text-base font-bold text-gray-900 tracking-tight mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Summary of Evaluation Results
          </h3>
          <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 text-sm text-gray-800 space-y-3 leading-relaxed">
            {friendlySummary.map((sentence, idx) => (
              <p key={idx} className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                <span>{sentence}</span>
              </p>
            ))}
          </div>
        </div>

        {/* SECTION 3: Strengths (Positive Green Cards) */}
        <div>
          <h3 className="text-base font-bold text-gray-900 tracking-tight mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            What Eleanor Does Well (Strengths)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {strengthsList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3 shadow-2xs"
              >
                <div className={`p-2 rounded-xl ${item.iconBg} flex-shrink-0 mt-0.5`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm">{item.title}</h4>
                  <p className="text-xs text-emerald-900 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: Areas to Practice (Friendly Suggestion Cards) */}
        <div>
          <h3 className="text-base font-bold text-gray-900 tracking-tight mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Areas to Practice Together
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {areasToPracticeList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start gap-3 shadow-2xs"
              >
                <div className={`p-2 rounded-xl ${item.iconBg} flex-shrink-0 mt-0.5`}>
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-950 text-sm">{item.title}</h4>
                  <p className="text-xs text-amber-900 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: Home Activities (5-8 Activity Cards) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              Recommended Home Activities
            </h3>
            <span className="text-xs font-semibold text-gray-500">7 Fun Daily Exercises</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {homeActivities.map((act) => {
              const IconComponent = act.icon;
              return (
                <div
                  key={act.id}
                  className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between space-y-3 ${act.bgColor}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-2 rounded-lg bg-white/80 shadow-2xs">
                      <IconComponent className="w-5 h-5 text-gray-800" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-gray-700 border border-black/5">
                      {act.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight">{act.title}</h4>
                    <p className="text-xs opacity-90 mt-1 leading-relaxed">{act.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 6: Teaching Resources (Placeholder Video Cards) */}
        <div>
          <h3 className="text-base font-bold text-gray-900 tracking-tight mb-3 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-blue-600" />
            Home Caregiver Video Modules
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teachingResources.map((res) => (
              <Card key={res.id} className="hover:shadow-md transition-shadow duration-200 flex flex-col justify-between !p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-blue-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <PlayCircle className="w-4 h-4" /> Video Guide
                    </span>
                    <span>{res.duration}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm leading-tight">{res.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{res.description}</p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setVideoModal({ isOpen: true, title: res.title })}
                  className="mt-4 text-xs w-full flex items-center justify-center gap-1.5"
                >
                  <PlayCircle className="w-4 h-4" /> Watch Video
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* SECTION 7: Motivational Message */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-sm flex flex-col sm:flex-row items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xs flex-shrink-0">
            <Heart className="w-8 h-8 fill-white text-white" />
          </div>
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-base">A Gentle Reminder for Caregivers</h4>
            <p className="text-xs md:text-sm mt-1 text-teal-50 font-medium leading-relaxed">
              "Every person develops and recovers at their own unique pace. Regular practice, patience, and encouraging support at home make a meaningful difference every single day."
            </p>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Caregiver Guide"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Send this home activity guide and evaluation summary directly to family members or caregivers for <span className="font-bold text-gray-900">{activePatientInfo.name}</span>.
          </p>

          <div className="space-y-2">
            <label htmlFor="caregiver-link" className="block text-xs font-semibold text-gray-700">Family Access Link</label>
            <div className="flex items-center gap-2">
              <input
                id="caregiver-link"
                type="text"
                readOnly
                value={`https://cat-portal.health/caregiver/CG-2026-084`}
                className="w-full p-2.5 text-xs bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-mono"
              />
              <Button
                variant="primary"
                onClick={handleCopyShareLink}
                className="text-xs flex items-center gap-1 flex-shrink-0"
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <Button variant="outline" onClick={() => setIsShareModalOpen(false)} className="text-xs">
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Video Modal (Placeholder Player) */}
      <Modal
        isOpen={videoModal.isOpen}
        onClose={() => setVideoModal({ isOpen: false, title: '' })}
        title={videoModal.title}
      >
        <div className="space-y-4">
          <div className="w-full h-56 bg-gray-900 rounded-xl flex flex-col items-center justify-center text-white p-6 text-center space-y-3 shadow-inner">
            <PlayCircle className="w-14 h-14 text-blue-400 animate-pulse" />
            <p className="text-sm font-semibold">Video Stream Demonstration Placeholder</p>
            <p className="text-xs text-gray-400">"{videoModal.title}" module is ready for playback.</p>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setVideoModal({ isOpen: false, title: '' })} className="text-xs">
              Close Player
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
