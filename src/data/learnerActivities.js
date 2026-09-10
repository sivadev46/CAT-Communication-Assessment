/**
 * Centralized Learner Activities Data Store
 * 
 * Contains 8 main categories with 4 placeholder activities each (32 total activities).
 * Each activity has an independent type: 'Receptive' or 'Expressive', and a videoUrl.
 * 
 * Replace individual videoUrl values, images, or descriptions when real activity content becomes available.
 */

const COMMON_PLACEHOLDER_VIDEO_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

export const LEARNER_CATEGORIES = [
  'Category 1',
  'Category 2',
  'Category 3',
  'Category 4',
  'Category 5',
  'Category 6',
  'Category 7',
  'Category 8',
];

export const LEARNER_ACTIVITIES = [
  // ==========================================
  // CATEGORY 1
  // ==========================================
  {
    id: 'cat1-act1',
    category: 'Category 1',
    title: 'Category 1 - Activity 1',
    type: 'Receptive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat1-act2',
    category: 'Category 1',
    title: 'Category 1 - Activity 2',
    type: 'Expressive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat1-act3',
    category: 'Category 1',
    title: 'Category 1 - Activity 3',
    type: 'Receptive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat1-act4',
    category: 'Category 1',
    title: 'Category 1 - Activity 4',
    type: 'Expressive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },

  // ==========================================
  // CATEGORY 2
  // ==========================================
  {
    id: 'cat2-act1',
    category: 'Category 2',
    title: 'Category 2 - Activity 1',
    type: 'Expressive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat2-act2',
    category: 'Category 2',
    title: 'Category 2 - Activity 2',
    type: 'Receptive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat2-act3',
    category: 'Category 2',
    title: 'Category 2 - Activity 3',
    type: 'Expressive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat2-act4',
    category: 'Category 2',
    title: 'Category 2 - Activity 4',
    type: 'Receptive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },

  // ==========================================
  // CATEGORY 3
  // ==========================================
  {
    id: 'cat3-act1',
    category: 'Category 3',
    title: 'Category 3 - Activity 1',
    type: 'Receptive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat3-act2',
    category: 'Category 3',
    title: 'Category 3 - Activity 2',
    type: 'Expressive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat3-act3',
    category: 'Category 3',
    title: 'Category 3 - Activity 3',
    type: 'Receptive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat3-act4',
    category: 'Category 3',
    title: 'Category 3 - Activity 4',
    type: 'Expressive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },

  // ==========================================
  // CATEGORY 4
  // ==========================================
  {
    id: 'cat4-act1',
    category: 'Category 4',
    title: 'Category 4 - Activity 1',
    type: 'Expressive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat4-act2',
    category: 'Category 4',
    title: 'Category 4 - Activity 2',
    type: 'Receptive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat4-act3',
    category: 'Category 4',
    title: 'Category 4 - Activity 3',
    type: 'Expressive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat4-act4',
    category: 'Category 4',
    title: 'Category 4 - Activity 4',
    type: 'Receptive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },

  // ==========================================
  // CATEGORY 5
  // ==========================================
  {
    id: 'cat5-act1',
    category: 'Category 5',
    title: 'Category 5 - Activity 1',
    type: 'Receptive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat5-act2',
    category: 'Category 5',
    title: 'Category 5 - Activity 2',
    type: 'Expressive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat5-act3',
    category: 'Category 5',
    title: 'Category 5 - Activity 3',
    type: 'Receptive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat5-act4',
    category: 'Category 5',
    title: 'Category 5 - Activity 4',
    type: 'Expressive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },

  // ==========================================
  // CATEGORY 6
  // ==========================================
  {
    id: 'cat6-act1',
    category: 'Category 6',
    title: 'Category 6 - Activity 1',
    type: 'Expressive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat6-act2',
    category: 'Category 6',
    title: 'Category 6 - Activity 2',
    type: 'Receptive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat6-act3',
    category: 'Category 6',
    title: 'Category 6 - Activity 3',
    type: 'Expressive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat6-act4',
    category: 'Category 6',
    title: 'Category 6 - Activity 4',
    type: 'Receptive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },

  // ==========================================
  // CATEGORY 7
  // ==========================================
  {
    id: 'cat7-act1',
    category: 'Category 7',
    title: 'Category 7 - Activity 1',
    type: 'Receptive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat7-act2',
    category: 'Category 7',
    title: 'Category 7 - Activity 2',
    type: 'Expressive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat7-act3',
    category: 'Category 7',
    title: 'Category 7 - Activity 3',
    type: 'Receptive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat7-act4',
    category: 'Category 7',
    title: 'Category 7 - Activity 4',
    type: 'Expressive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },

  // ==========================================
  // CATEGORY 8
  // ==========================================
  {
    id: 'cat8-act1',
    category: 'Category 8',
    title: 'Category 8 - Activity 1',
    type: 'Expressive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat8-act2',
    category: 'Category 8',
    title: 'Category 8 - Activity 2',
    type: 'Receptive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat8-act3',
    category: 'Category 8',
    title: 'Category 8 - Activity 3',
    type: 'Expressive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
  {
    id: 'cat8-act4',
    category: 'Category 8',
    title: 'Category 8 - Activity 4',
    type: 'Receptive',
    image: null,
    description: 'Activity description will be added here.',
    videoUrl: COMMON_PLACEHOLDER_VIDEO_URL,
  },
];

export const getActivitiesByCategory = (categoryName) => {
  return LEARNER_ACTIVITIES.filter((act) => act.category === categoryName);
};

/**
 * Utility to convert standard YouTube URLs into embeddable URLs for iframes.
 * Handles:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 */
export const getYouTubeEmbedUrl = (url) => {
  if (!url || typeof url !== 'string') return null;

  try {
    const trimmed = url.trim();

    // Already embed URL
    if (trimmed.includes('youtube.com/embed/')) {
      return trimmed;
    }

    // Standard watch URL: youtube.com/watch?v=VIDEO_ID
    if (trimmed.includes('youtube.com/watch')) {
      const parsedUrl = new URL(trimmed);
      const videoId = parsedUrl.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // Short URL: youtu.be/VIDEO_ID
    if (trimmed.includes('youtu.be/')) {
      const parts = trimmed.split('youtu.be/');
      if (parts[1]) {
        const videoId = parts[1].split('?')[0].split('&')[0];
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
    }

    // YouTube Shorts: youtube.com/shorts/VIDEO_ID
    if (trimmed.includes('youtube.com/shorts/')) {
      const parts = trimmed.split('youtube.com/shorts/');
      if (parts[1]) {
        const videoId = parts[1].split('?')[0].split('&')[0];
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
    }

    return trimmed;
  } catch {
    return null;
  }
};
