import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LEARNER_CATEGORIES,
  LEARNER_ACTIVITIES,
  getActivitiesByCategory,
  getYouTubeEmbedUrl,
} from '../data/learnerActivities';
import {
  getCompletedActivities,
  toggleActivityCompletion,
} from '../utils/learnerProgress';
import {
  BookOpen,
  Image as ImageIcon,
  Sparkles,
  X,
  Layers,
  CheckCircle,
  CheckCircle2,
  ExternalLink,
  Info,
  Play,
  Video,
  AlertCircle,
} from 'lucide-react';

export default function LearnerLearningModules() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(LEARNER_CATEGORIES[0]);
  const [activeModalActivity, setActiveModalActivity] = useState(null);
  const [completedActivities, setCompletedActivities] = useState(() =>
    getCompletedActivities(user)
  );

  const activitiesForCategory = getActivitiesByCategory(selectedCategory);

  const handleToggleComplete = (activityId) => {
    const updated = toggleActivityCompletion(user, activityId);
    setCompletedActivities(updated);
  };

  const isModalActivityCompleted =
    activeModalActivity && completedActivities.includes(activeModalActivity.id);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-purple-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-purple-700 font-extrabold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Learning Modules</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-purple-950">
            Communication Activities
          </h1>
          <p className="text-xs sm:text-sm text-purple-900 mt-1 font-medium">
            Select a category from the top bar to view and explore activities.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 text-xs text-purple-800 font-bold bg-white border border-purple-200 px-3.5 py-2 rounded-xl shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>{completedActivities.length} / 32 Completed</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-purple-800 font-bold bg-white border border-purple-200 px-3.5 py-2 rounded-xl shadow-xs">
            <Layers className="w-4 h-4 text-purple-700" />
            <span>8 Categories</span>
          </div>
        </div>
      </div>

      {/* TOP HORIZONTAL CATEGORY NAVIGATION BAR (Exactly 8 Categories) */}
      <div className="bg-white rounded-2xl border-2 border-purple-100 p-2 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-purple-200">
          {LEARNER_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-700 text-white shadow-md shadow-purple-900/15'
                    : 'text-purple-900 hover:bg-purple-50 hover:text-purple-950'
                }`}
              >
                <span>{category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Category Title & Activity Count */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-black text-purple-950">{selectedCategory}</h2>
          <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
            {activitiesForCategory.length} Activities
          </span>
        </div>
        <p className="text-xs text-purple-800 hidden sm:block font-medium">
          Click any activity image below to view details, watch video, and mark as done
        </p>
      </div>

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {activitiesForCategory.map((activity) => {
          const isReceptive = activity.type === 'Receptive';
          const isDone = completedActivities.includes(activity.id);

          return (
            <div
              key={activity.id}
              className={`bg-white rounded-2xl border-2 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group ${
                isDone
                  ? 'border-green-300 ring-1 ring-green-200'
                  : 'border-purple-100 hover:border-purple-300'
              }`}
            >
              {/* Top: Large Clickable Image Placeholder */}
              <div
                onClick={() => setActiveModalActivity(activity)}
                className="relative aspect-video sm:aspect-4/3 bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100/60 border-b border-purple-100 flex flex-col items-center justify-center p-4 cursor-pointer group-hover:brightness-98 transition-all"
                title="Click to view activity details and video"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-purple-200 text-purple-700 flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-purple-950 tracking-tight">
                  [ Activity Image ]
                </span>
                <span className="text-[10px] text-purple-700 mt-1 font-bold flex items-center gap-1">
                  <Play className="w-3 h-3 fill-purple-700" />
                  <span>Click to open video</span>
                </span>

                {/* Subtle Type Badge positioned at top right of image area */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  {isDone && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-green-600 text-white shadow-xs flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Done</span>
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-xs ${
                      isReceptive
                        ? 'bg-blue-600 text-white'
                        : 'bg-purple-700 text-white'
                    }`}
                  >
                    {activity.type}
                  </span>
                </div>
              </div>

              {/* Bottom: Title & Details */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-purple-950 text-sm leading-snug">
                    {activity.title}
                  </h3>
                  <p className="text-xs text-purple-800 mt-1 line-clamp-2 font-medium">
                    {activity.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-purple-50 flex items-center justify-between">
                  <span className="text-[11px] text-purple-700 font-bold">
                    {activity.category}
                  </span>
                  <button
                    onClick={() => setActiveModalActivity(activity)}
                    className="text-xs text-purple-700 hover:text-purple-950 font-extrabold cursor-pointer hover:underline flex items-center gap-1"
                  >
                    <span>View Activity</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTIVITY DETAIL MODAL WITH YOUTUBE VIDEO & MARK AS DONE */}
      {activeModalActivity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/70 backdrop-blur-xs p-3 sm:p-4 animate-fadeIn"
          onClick={() => setActiveModalActivity(null)}
        >
          <div
            className="bg-white rounded-3xl border-2 border-purple-200 shadow-2xl max-w-2xl w-full overflow-hidden relative flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-purple-100 flex items-center justify-between bg-purple-50/60 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg shadow-xs ${
                    activeModalActivity.type === 'Receptive'
                      ? 'bg-blue-600 text-white'
                      : 'bg-purple-700 text-white'
                  }`}
                >
                  {activeModalActivity.type}
                </span>
                <span className="text-xs font-bold text-purple-800">
                  {activeModalActivity.category}
                </span>
                {isModalActivityCompleted && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-green-600 text-white flex items-center gap-1 shadow-xs">
                    <CheckCircle className="w-3 h-3" />
                    <span>Completed</span>
                  </span>
                )}
              </div>

              <button
                onClick={() => setActiveModalActivity(null)}
                className="p-1.5 rounded-xl text-purple-800 hover:bg-purple-200 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-purple-950 leading-snug">
                  {activeModalActivity.title}
                </h3>
              </div>

              {/* 1. Activity Description */}
              <div className="bg-purple-50/70 rounded-2xl border border-purple-100 p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-purple-950">
                  <Info className="w-4 h-4 text-purple-700" />
                  <span>Activity Description</span>
                </div>
                <p className="text-xs sm:text-sm text-purple-900 leading-relaxed font-medium">
                  {activeModalActivity.description}
                </p>
              </div>

              {/* 2. Activity Photo / Image Placeholder Area */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-purple-950">
                  <ImageIcon className="w-4 h-4 text-purple-700" />
                  <span>Activity Photo</span>
                </div>

                <div className="aspect-16/8 bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 rounded-2xl border-2 border-dashed border-purple-300 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-purple-200 text-purple-700 flex items-center justify-center mb-2 shadow-xs">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-extrabold text-purple-950">
                    [ Activity Photo Placeholder ]
                  </span>
                  <p className="text-[11px] text-purple-800 mt-1 max-w-xs font-medium">
                    High-resolution activity photo and visual prompt will appear here.
                  </p>
                </div>
              </div>

              {/* 3. YouTube Video Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-purple-950">
                  <Video className="w-4 h-4 text-purple-700" />
                  <span>Activity Video</span>
                </div>

                {activeModalActivity.videoUrl ? (
                  <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border-2 border-purple-200 shadow-md">
                    {getYouTubeEmbedUrl(activeModalActivity.videoUrl) ? (
                      <iframe
                        src={getYouTubeEmbedUrl(activeModalActivity.videoUrl)}
                        title={activeModalActivity.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 p-4 text-center">
                        <AlertCircle className="w-8 h-8 text-purple-400 mb-2" />
                        <span className="text-xs font-bold">Invalid video URL format</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-purple-50 rounded-2xl border-2 border-dashed border-purple-200 flex flex-col items-center justify-center p-6 text-center text-purple-800">
                    <Video className="w-8 h-8 text-purple-400 mb-2" />
                    <span className="text-xs font-bold">Video unavailable for this activity</span>
                  </div>
                )}
              </div>

              {/* 4. Mark as Done Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleToggleComplete(activeModalActivity.id)}
                  className={`w-full py-3 px-5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    isModalActivityCompleted
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20'
                      : 'bg-purple-700 hover:bg-purple-800 text-white shadow-purple-700/20'
                  }`}
                >
                  {isModalActivityCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>✓ Done (Click to Undo)</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-purple-200" />
                      <span>Mark as Done</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-purple-100 bg-purple-50/40 flex justify-end">
              <button
                onClick={() => setActiveModalActivity(null)}
                className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
