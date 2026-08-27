import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle2,
  X,
  Tag,
  Puzzle,
  ChevronRight,
  TrendingUp,
  Brain,
  MessageSquare,
  AlertCircle,
  Video
} from 'lucide-react';
import Header from '../components/Header/Header';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';
import PracticeRecordModal from '../components/Modal/PracticeRecordModal';
import { reportService } from '../services/reportService';
import { useAuth } from '../context/AuthContext';
import { therapyActivities, therapyCategories, difficultyLevels } from '../data/therapyActivitiesData';

export default function TherapyActivities() {
  const { user } = useAuth();
  // Session storage state initialization
  const [searchQuery, setSearchQuery] = useState(() => {
    return sessionStorage.getItem('therapyActivities_searchQuery') || '';
  });
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return sessionStorage.getItem('therapyActivities_selectedCategory') || 'All';
  });
  const [selectedDifficulty, setSelectedDifficulty] = useState(() => {
    return sessionStorage.getItem('therapyActivities_selectedDifficulty') || 'All';
  });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [parentReportContext, setParentReportContext] = useState(null);

  useEffect(() => {
    if (user?.role === 'parent') {
      reportService.getReports().then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setParentReportContext(res.data[0]);
        }
      }).catch(() => {});
    }
  }, [user]);

  // Sync state to session storage
  useEffect(() => {
    sessionStorage.setItem('therapyActivities_searchQuery', searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    sessionStorage.setItem('therapyActivities_selectedCategory', selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    sessionStorage.setItem('therapyActivities_selectedDifficulty', selectedDifficulty);
  }, [selectedDifficulty]);

  // Keyboard accessibility: close modal or lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else if (selectedActivity) {
          setSelectedActivity(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedActivity, isLightboxOpen]);

  // Prevent background scroll when modal or lightbox is active
  useEffect(() => {
    if (selectedActivity || isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedActivity, isLightboxOpen]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return therapyActivities.filter((act) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        act.title.toLowerCase().includes(query) ||
        act.description.toLowerCase().includes(query) ||
        act.category.toLowerCase().includes(query) ||
        act.relatedAssessment.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'All' || act.category === selectedCategory;

      const matchesDifficulty =
        selectedDifficulty === 'All' || act.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  // Helper to color difficulty badges
  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-gray-800">
      
      {/* Page Header Component and Right Stats Row */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 border-b border-gray-100 pb-5">
        <div className="flex-1">
          <Header
            title="🧩 Therapy Activities"
            subtitle="Guided home-based therapy activities designed to help parents practice communication skills with their child."
          />
        </div>

        {/* Stats Row on the Right */}
        <div className="flex items-center gap-3 self-start lg:self-center">
          <div className="bg-white border border-gray-200 shadow-xs rounded-xl p-3 text-center min-w-[100px] flex flex-col justify-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</span>
            <span className="text-2xl font-extrabold text-emerald-600 mt-0.5">{therapyActivities.length}</span>
          </div>
          <div className="bg-white border border-gray-200 shadow-xs rounded-xl p-3 text-center min-w-[100px] flex flex-col justify-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Categories</span>
            <span className="text-2xl font-extrabold text-teal-600 mt-0.5">{therapyCategories.length}</span>
          </div>
          <div className="bg-white border border-gray-200 shadow-xs rounded-xl p-3 text-center min-w-[100px] flex flex-col justify-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Difficulty</span>
            <span className="text-xs font-bold text-amber-600 mt-2 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-md">
              {selectedDifficulty === 'All' ? 'Beginner+' : selectedDifficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by activity, category, or related assessment skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-gray-800 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Difficulty Dropdown Selector */}
          <div className="relative min-w-[160px]">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg pl-3.5 pr-8 py-2.5 text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="All">All Difficulties</option>
              {difficultyLevels.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <span className="text-[10px]">▼</span>
            </div>
          </div>
        </div>

        {/* Category Pills (horizontal list) */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap mr-1 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>

          {therapyCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid View */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Puzzle className="w-5 h-5 text-emerald-600" />
            Home Intervention Modules
          </h2>
          <span className="text-xs font-medium text-gray-500">
            Showing {filteredActivities.length} of {therapyActivities.length} Activities
          </span>
        </div>

        {filteredActivities.length === 0 ? (
          /* Empty State */
          <Card className="text-center py-16 px-4 border border-gray-200 shadow-sm bg-white">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No therapy activities found.</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              No home-based interventions matched your current search filters. Try clearing your search query or selecting a different category.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
              }}
              className="mt-4 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 cursor-pointer"
            >
              Reset All Filters
            </Button>
          </Card>
        ) : (
          /* Responsive Activity Grid (3 cols desktop, 2 cols tablet, 1 col mobile) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <Card
                key={activity.id}
                className="group hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden !p-0 border border-gray-200 bg-white"
              >
                {/* Activity Thumbnail with offline gradient SVG fallback */}
                <div
                  onClick={() => setSelectedActivity(activity)}
                  className="relative h-44 bg-slate-100 cursor-pointer overflow-hidden flex items-center justify-center border-b border-gray-100"
                >
                  <img
                    src={activity.imagePath}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Category Overlays */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-gray-800 shadow-2xs border border-gray-100">
                      {activity.category}
                    </span>
                  </div>

                  {/* Duration Overlay */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 z-10">
                    <span className="flex items-center gap-1 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs">
                      <Clock className="w-3 h-3 text-white" /> {activity.duration}
                    </span>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getDifficultyColor(activity.difficulty)}`}>
                        {activity.difficulty}
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedActivity(activity)}
                      className="font-bold text-gray-900 text-sm leading-snug cursor-pointer line-clamp-2 hover:text-emerald-600 transition-colors"
                    >
                      {activity.title}
                    </h3>
                    
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {activity.description}
                    </p>
                  </div>

                  {/* Button trigger */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-medium">
                      Skill: {activity.relatedAssessment.split(' ').slice(0, 3).join(' ')}...
                    </span>
                    <button
                      onClick={() => setSelectedActivity(activity)}
                      className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>View Activity</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Activity Details Modal (Detailed View) */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          
          {/* Modal Container */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-2">
                <Puzzle className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                  {selectedActivity.category}
                </span>
                <span className={`text-[10px] font-bold border px-2.5 py-0.5 rounded-full ${getDifficultyColor(selectedActivity.difficulty)}`}>
                  {selectedActivity.difficulty}
                </span>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* Top Section: Large Activity Image + Title Header */}
              <div className="space-y-4">
                <div 
                  onClick={() => setIsLightboxOpen(true)}
                  className="w-full h-56 sm:h-72 rounded-xl overflow-hidden border border-gray-200 bg-slate-50 flex items-center justify-center shadow-inner relative cursor-zoom-in group transition-all duration-300"
                >
                  <img
                    src={selectedActivity.imagePath}
                    alt={selectedActivity.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  
                  {/* Subtle zoom hint overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white text-xs font-semibold px-3 py-2 rounded-lg backdrop-blur-xs transition-opacity duration-300 shadow-xs flex items-center gap-1.5">
                      🔍 Click to Zoom
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                    <span className="flex items-center gap-1.5 bg-black/75 text-white text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-xs">
                      <Clock className="w-3.5 h-3.5 text-white" /> Estimated: {selectedActivity.duration}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight leading-snug">
                    {selectedActivity.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {selectedActivity.description}
                  </p>
                </div>
              </div>

              {/* Two-Column Structured Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Left Side: Clinical Goals & Assessments */}
                <div className="space-y-5">
                  
                  {/* Clinical Goal Card */}
                  <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl space-y-2">
                    <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      Intervention Goal
                    </h4>
                    <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                      {selectedActivity.goal}
                    </p>
                  </div>

                  {/* Related Assessment Skill Card (Required Point 4) */}
                  <div className="bg-blue-50/40 border border-blue-100 p-4 rounded-xl space-y-2">
                    <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-blue-600" />
                      Related Assessment Skill
                    </h4>
                    <p className="text-xs text-blue-800 leading-relaxed font-semibold">
                      {selectedActivity.relatedAssessment}
                    </p>
                    <p className="text-[10px] text-blue-600 leading-normal">
                      Designed to practice and master this behavior evaluated in clinical reports.
                    </p>
                  </div>

                  {/* Things to Remember Card */}
                  <div className="bg-amber-50/40 border border-amber-100 p-4 rounded-xl space-y-2">
                    <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Things to Remember
                    </h4>
                    <ul className="space-y-1.5 text-xs text-amber-800">
                      {selectedActivity.thingsToRemember.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 bg-amber-600 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Side: Instructions & Parent Tips */}
                <div className="space-y-5">
                  
                  {/* Step-by-Step Instructions */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      Step-by-Step Instructions
                    </h4>
                    <ol className="space-y-3">
                      {selectedActivity.instructions.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-xs text-gray-700 leading-relaxed">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Parent Practice Tips */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      Parent Practice Tips
                    </h4>
                    <ul className="space-y-2">
                      {selectedActivity.parentTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full mt-2 bg-emerald-500 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer with disabled Coming Soon Buttons (Required Point 6) */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              {/* Future feature buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  disabled
                  title="Animated interactive exercises coming soon"
                  className="px-3 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-400 text-xs font-semibold flex items-center gap-1.5 cursor-not-allowed select-none opacity-80"
                >
                  <span>▶ Animated Version</span>
                  <span className="text-[9px] px-1 bg-gray-200 text-gray-500 rounded-md font-bold">Coming Soon</span>
                </button>
                
                <button
                  disabled
                  title="Clinical teaching video demo coming soon"
                  className="px-3 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-400 text-xs font-semibold flex items-center gap-1.5 cursor-not-allowed select-none opacity-80"
                >
                  <span>🎥 Related Teaching Video</span>
                  <span className="text-[9px] px-1 bg-gray-200 text-gray-500 rounded-md font-bold">Coming Soon</span>
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {user?.role === 'parent' && (
                  <button
                    onClick={() => setIsRecordModalOpen(true)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Video className="w-4 h-4" />
                    <span>Record Practice</span>
                  </button>
                )}

                <Button
                  variant="outline"
                  onClick={() => setSelectedActivity(null)}
                  className="text-xs py-2 px-4 cursor-pointer hover:bg-gray-100 border-gray-300 text-gray-700"
                >
                  Close View
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Image Viewer */}
      {isLightboxOpen && selectedActivity && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300 ease-out animate-fade-in"
        >
          {/* Custom self-contained styles for premium springy animations */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleUp {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            .animate-fade-in {
              animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .animate-scale-up {
              animation: scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          `}} />

          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-70 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-gray-200 transition-colors flex items-center justify-center text-xl font-bold cursor-pointer border border-white/10 shadow-lg"
            aria-label="Close fullscreen view"
          >
            ✕
          </button>

          {/* Centered Image container */}
          <div className="relative max-w-full max-h-full flex items-center justify-center animate-scale-up">
            <img
              src={selectedActivity.imagePath}
              alt={selectedActivity.title}
              onClick={(e) => e.stopPropagation()} // Prevents click inside from closing
              className="max-w-[90vw] max-h-[85vh] md:max-w-[95vw] md:max-h-[90vh] object-contain rounded-lg shadow-2xl border border-white/5"
            />
          </div>
        </div>
      )}

      {/* Practice Record Modal */}
      {selectedActivity && (
        <PracticeRecordModal
          isOpen={isRecordModalOpen}
          onClose={() => setIsRecordModalOpen(false)}
          activity={selectedActivity}
          childName={parentReportContext?.assessment?.patient?.fullName || "Your Child"}
          patientId={parentReportContext?.patientId || parentReportContext?.assessment?.patient?._id || parentReportContext?.assessment?.patient}
          reportId={parentReportContext?._id}
          assessmentId={parentReportContext?.assessment?._id || parentReportContext?.assessment}
          doctorName={parentReportContext?.generatedBy?.fullName || "Dr. Sarah Jenkins"}
          clinicianId={parentReportContext?.doctorId || parentReportContext?.generatedBy?._id || parentReportContext?.generatedBy}
        />
      )}
    </div>
  );
}
