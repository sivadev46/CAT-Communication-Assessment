import React, { useState, useMemo } from 'react';
import {
  Youtube,
  Search,
  Filter,
  Heart,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle2,
  X,
  Tag,
  Film,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import Header from '../components/Header/Header';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';
import Modal from '../components/Modal/Modal';
import { videoCategories, mockVideos } from '../data/videosData';

export default function TeachingVideos() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Local state for favorite video IDs
  const [favorites, setFavorites] = useState(['vid-01', 'vid-03', 'vid-08']);

  // Local state for recently viewed videos
  const [recentlyViewed, setRecentlyViewed] = useState(['vid-01', 'vid-05']);

  // Video Player Modal state
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Toggle favorite
  const toggleFavorite = (e, videoId) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]
    );
  };

  // Open Video Player modal & record in recently viewed
  const handleOpenVideo = (video) => {
    setSelectedVideo(video);
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== video.id);
      return [video.id, ...filtered].slice(0, 5);
    });
  };

  // Filtered Video Library
  const filteredVideos = useMemo(() => {
    return mockVideos.filter((vid) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        vid.title.toLowerCase().includes(query) ||
        vid.description.toLowerCase().includes(query) ||
        vid.category.toLowerCase().includes(query) ||
        vid.tags.some((t) => t.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === 'All' || vid.category === selectedCategory;

      const matchesFavorite = !onlyFavorites || favorites.includes(vid.id);

      return matchesSearch && matchesCategory && matchesFavorite;
    });
  }, [searchQuery, selectedCategory, onlyFavorites, favorites]);

  // Recommended videos based on selected video or active category
  const recommendedVideos = useMemo(() => {
    if (selectedVideo) {
      return mockVideos
        .filter((v) => v.id !== selectedVideo.id && v.category === selectedVideo.category)
        .slice(0, 3);
    }
    const targetCat = selectedCategory === 'All' ? 'Eye Contact' : selectedCategory;
    return mockVideos.filter((v) => v.category === targetCat).slice(0, 3);
  }, [selectedVideo, selectedCategory]);

  // Recently Viewed Video objects
  const recentVideoObjects = useMemo(() => {
    return recentlyViewed
      .map((id) => mockVideos.find((v) => v.id === id))
      .filter(Boolean);
  }, [recentlyViewed]);

  const getDifficultyBadge = (level) => {
    switch (level) {
      case 'Beginner':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Beginner
          </span>
        );
      case 'Intermediate':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Intermediate
          </span>
        );
      case 'Advanced':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            Advanced
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <Header
        title="Teaching Videos"
        subtitle="Watch instructional videos linked to communication behaviours and intervention techniques."
      />

      {/* Search & Filter Controls */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by behaviour name, category, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-800 transition-all"
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

          {/* Favorites Filter Toggle */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              onlyFavorites
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
            <span>Favourites ({favorites.length})</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {videoCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Grid of Videos + Sidebar (Recently Viewed & Recommended) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left / Center 3 Columns: Video Library */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Film className="w-5 h-5 text-blue-600" />
              Instructional Video Library
            </h2>
            <span className="text-xs font-medium text-gray-500">
              Showing {filteredVideos.length} of {mockVideos.length} Modules
            </span>
          </div>

          {filteredVideos.length === 0 ? (
            <Card className="text-center py-16 px-4">
              <Film className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">No teaching videos found.</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No instructional videos matched your current search criteria or category filter.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setOnlyFavorites(false);
                }}
                className="mt-4 text-xs"
              >
                Reset Search Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVideos.map((video) => {
                const isFav = favorites.includes(video.id);
                return (
                  <Card
                    key={video.id}
                    className="group hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden !p-0 border border-gray-200"
                  >
                    {/* Video Thumbnail using live YouTube API */}
                    <div
                      onClick={() => handleOpenVideo(video)}
                      className="relative h-40 bg-slate-900 cursor-pointer overflow-hidden"
                    >
                      <img 
                        src={`https://img.youtube.com/vi/${video.youtubeVideoId}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Header overlay */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/95 text-gray-800 shadow-sm">
                          {video.category}
                        </span>
                      </div>

                      <button
                        onClick={(e) => toggleFavorite(e, video.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-black/45 hover:bg-black/60 text-white backdrop-blur-xs transition-colors cursor-pointer z-20"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                      </button>

                      {/* Video Badges Bottom Overlay */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10">
                        <span className="flex items-center gap-1 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                          <Clock className="w-3 h-3" /> {video.duration}
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-red-655 text-white text-[9px] font-bold flex items-center gap-1 backdrop-blur-xs shadow-sm z-10">
                        <Youtube className="w-3 h-3 text-white fill-white" />
                        <span>YouTube</span>
                      </div>
                    </div>

                    {/* Video Card Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                      <div>
                        <h3
                          onClick={() => handleOpenVideo(video)}
                          className="font-bold text-gray-900 text-sm leading-snug hover:text-blue-600 cursor-pointer line-clamp-2"
                        >
                          {video.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {video.description}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {video.tags.slice(0, 2).map((beh, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-600 flex items-center gap-0.5"
                          >
                            <Tag className="w-2.5 h-2.5 text-slate-400" /> {beh}
                          </span>
                        ))}
                      </div>

                      {/* Card Action */}
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span>
                          {getDifficultyBadge(video.difficulty)}
                        </span>
                        
                        <Button
                          variant="outline"
                          onClick={() => window.open(video.youtubeUrl, '_blank')}
                          className="text-[11px] py-1.5 px-3 flex items-center gap-1.5 cursor-pointer bg-red-50 hover:bg-red-100/80 text-red-600 border border-red-200"
                        >
                          <Youtube className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                          <span>▶ Watch on YouTube</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar: Recently Viewed & Recommended */}
        <div className="space-y-6">
          
          {/* Recently Viewed Panel */}
          <Card className="!p-4 space-y-3 border border-gray-200 shadow-2xs">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-blue-600" />
              Recently Viewed
            </h3>
            {recentVideoObjects.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No recently watched videos.</p>
            ) : (
              <div className="space-y-2.5">
                {recentVideoObjects.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => handleOpenVideo(vid)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                  >
                    <div className="w-12 h-10 rounded-md overflow-hidden bg-slate-900 flex-shrink-0 relative">
                      <img 
                        src={`https://img.youtube.com/vi/${vid.youtubeVideoId}/mqdefault.jpg`} 
                        alt="" 
                        className="w-full h-full object-cover opacity-80" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Youtube className="w-4 h-4 text-red-600 fill-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate leading-tight">{vid.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{vid.category} • {vid.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recommended Videos Panel */}
          <Card className="!p-4 space-y-3 bg-blue-50/40 border border-blue-100">
            <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Recommended Modules
            </h3>
            <div className="space-y-3">
              {recommendedVideos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => handleOpenVideo(vid)}
                  className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      {vid.category}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> {vid.duration}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2">{vid.title}</h4>
                  <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                    <span className="text-[9px] text-gray-400">{vid.difficulty}</span>
                    <span className="text-xs font-semibold text-blue-650 flex items-center gap-0.5 hover:underline">
                      Watch <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <Modal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          title={selectedVideo.title}
        >
          <div className="space-y-5 text-xs text-gray-700">
            
            {/* Embedded Live YouTube Player using iframe */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md bg-slate-900 border border-slate-800">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeVideoId}?rel=0&autoplay=1`}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Title & Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {selectedVideo.category}
                </span>
                {getDifficultyBadge(selectedVideo.difficulty)}
                <span className="text-slate-400 text-xs flex items-center gap-0.5 ml-2">
                  <Clock className="w-3.5 h-3.5" /> {selectedVideo.duration}
                </span>
              </div>
              <button
                onClick={(e) => toggleFavorite(e, selectedVideo.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border ${
                  favorites.includes(selectedVideo.id)
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${favorites.includes(selectedVideo.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{favorites.includes(selectedVideo.id) ? 'Favourited' : 'Add to Favourites'}</span>
              </button>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1">Module Overview</h4>
              <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">{selectedVideo.description}</p>
            </div>

            {/* Learning Objectives */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Key Learning Objectives
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-800">
                {selectedVideo.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Behaviors Tags */}
            <div>
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">Target Communication Behaviours</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedVideo.tags.map((b, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-medium text-xs border border-blue-100 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-blue-500" /> {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => window.open(selectedVideo.youtubeUrl, '_blank')}
                className="text-xs flex items-center gap-1.5 bg-red-50 text-red-655 hover:bg-red-100/80 border-red-200"
              >
                <Youtube className="w-4 h-4 fill-red-600 text-red-600" />
                <span>Open in YouTube Tab</span>
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => setSelectedVideo(null)}
                className="text-xs"
              >
                Close Video Player
              </Button>
            </div>

          </div>
        </Modal>
      )}
    </div>
  );
}
