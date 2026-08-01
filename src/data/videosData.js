export const videoCategories = [
  'All',
  'Eye Contact',
  'Joint Attention',
  'Receptive Language',
  'Expressive Language',
  'Social Interaction',
];

export const mockVideos = [
  {
    id: 'vid-01',
    title: 'Facilitating Sustained Eye Contact During Conversation',
    category: 'Eye Contact',
    duration: '04:15',
    difficulty: 'Beginner',
    description: 'Techniques for encouraging direct gaze during greetings and simple question-and-answer interactions.',
    objectives: [
      'Learn positioning strategies to align at eye level with the learner.',
      'Utilize visual focal points and positive reinforcement.',
      'Recognize over-stimulation cues and implement sensory pauses.'
    ],
    relatedBehaviors: ['Sustained Gaze', 'Social Greeting', 'Turn-Taking'],
    thumbnailBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    views: '1.2k',
    author: 'Dr. Sarah Jenkins, CCC-SLP'
  },
  {
    id: 'vid-02',
    title: 'Naturalistic Gaze Prompting in Everyday Play',
    category: 'Eye Contact',
    duration: '05:30',
    difficulty: 'Intermediate',
    description: 'Integrating eye contact prompts into play routines without causing anxiety or pressure.',
    objectives: [
      'Bring preferred objects near eyes before releasing them.',
      'Use playful pauses to prompt natural eye contact.',
      'Build gaze duration gradually from 1 second to 3+ seconds.'
    ],
    relatedBehaviors: ['Joint Attention', 'Play Engagement'],
    thumbnailBg: 'bg-gradient-to-br from-blue-600 to-teal-600',
    views: '940',
    author: 'Mark Davis, Pediatric SLP'
  },
  {
    id: 'vid-03',
    title: 'Joint Attention: Gaze Following & Pointing',
    category: 'Joint Attention',
    duration: '06:10',
    difficulty: 'Beginner',
    description: 'How to guide learners to follow finger points and shared focal objects in the room.',
    objectives: [
      'Master the "Look at that!" pointing technique.',
      'Establish triadic attention between clinician, learner, and item.',
      'Use vocal inflection to draw shared focus.'
    ],
    relatedBehaviors: ['Point Following', 'Shared Interest', 'Receptive Cueing'],
    thumbnailBg: 'bg-gradient-to-br from-teal-500 to-emerald-600',
    views: '2.1k',
    author: 'Dr. Emily Chen, Clinical Director'
  },
  {
    id: 'vid-04',
    title: 'Building Shared Focus through Storybook Reading',
    category: 'Joint Attention',
    duration: '04:45',
    difficulty: 'Intermediate',
    description: 'Using high-contrast picture books to develop prolonged joint attention during reading time.',
    objectives: [
      'Select high-engagement sensory picture books.',
      'Pause on key images to invite joint pointing.',
      'Combine auditory naming with physical page-touching.'
    ],
    relatedBehaviors: ['Book Engagement', 'Receptive Naming'],
    thumbnailBg: 'bg-gradient-to-br from-emerald-500 to-teal-700',
    views: '1.5k',
    author: 'Laura Adams, MS, CCC-SLP'
  },
  {
    id: 'vid-05',
    title: '1-Step and 2-Step Command Comprehension',
    category: 'Receptive Language',
    duration: '05:00',
    difficulty: 'Beginner',
    description: 'Scaffolding verbal instructions with visual gesture prompts for enhanced listening comprehension.',
    objectives: [
      'Structure concise verbal commands (e.g. "Pick up ball, put in box").',
      'Fade physical prompts systematically.',
      'Evaluate response latency and comprehension accuracy.'
    ],
    relatedBehaviors: ['Instruction Following', 'Auditory Processing'],
    thumbnailBg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    views: '3.4k',
    author: 'Robert Vance, Lead Speech Pathologist'
  },
  {
    id: 'vid-06',
    title: 'Object Identification & Receptive Naming',
    category: 'Receptive Language',
    duration: '03:55',
    difficulty: 'Beginner',
    description: 'Interactive drills for identifying household items, animals, and common tools upon request.',
    objectives: [
      'Arrange 3-card array choices for clear decision making.',
      'Reinforce correct object selections with immediate praise.',
      'Expand vocabulary arrays progressively.'
    ],
    relatedBehaviors: ['Receptive Vocabulary', 'Choice Making'],
    thumbnailBg: 'bg-gradient-to-br from-purple-500 to-pink-600',
    views: '1.8k',
    author: 'Dr. Sarah Jenkins, CCC-SLP'
  },
  {
    id: 'vid-07',
    title: 'Auditory Memory & Sequential Comprehension',
    category: 'Receptive Language',
    duration: '07:20',
    difficulty: 'Advanced',
    description: 'Advanced clinical exercises for improving multi-step auditory processing and memory recall.',
    objectives: [
      'Introduce 3-step sequential auditory tasks.',
      'Incorporate brief delay periods before task execution.',
      'Track comprehension retention across sessions.'
    ],
    relatedBehaviors: ['Auditory Working Memory', 'Complex Tasks'],
    thumbnailBg: 'bg-gradient-to-br from-blue-600 to-purple-700',
    views: '890',
    author: 'Dr. Emily Chen, Clinical Director'
  },
  {
    id: 'vid-08',
    title: 'Melodic Intonation & Single Word Retrieval',
    category: 'Expressive Language',
    duration: '06:40',
    difficulty: 'Intermediate',
    description: 'Using pitch and rhythm patterns to unlock verbal word production in expressive aphasia.',
    objectives: [
      'Tapping rhythmically to assist syllable initiation.',
      'Transitioning from hummed melodies to spoken phrases.',
      'Practicing essential functional words (water, help, yes/no).'
    ],
    relatedBehaviors: ['Word Retrieval', 'Vocal Pitch', 'Syllable Staging'],
    thumbnailBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    views: '2.7k',
    author: 'Rachel Taylor, Neurological SLP'
  },
  {
    id: 'vid-09',
    title: 'Expanding Single Words to 2-3 Word Phrases',
    category: 'Expressive Language',
    duration: '05:15',
    difficulty: 'Intermediate',
    description: 'Scaffolding single-noun utterances into carrier phrases (e.g., "want apple", "big bus").',
    objectives: [
      'Utilize sentence strip visual helpers.',
      'Model carrier phrases with clear articulation.',
      'Encourage self-correction and verbal repetition.'
    ],
    relatedBehaviors: ['Phrase Building', 'Expressive Syntax'],
    thumbnailBg: 'bg-gradient-to-br from-orange-500 to-rose-600',
    views: '1.9k',
    author: 'Mark Davis, Pediatric SLP'
  },
  {
    id: 'vid-10',
    title: 'Augmentative & Alternative Communication (AAC) Basics',
    category: 'Expressive Language',
    duration: '08:00',
    difficulty: 'Advanced',
    description: 'Combining picture exchange cards and speech-generating devices for non-verbal learners.',
    objectives: [
      'Set up intuitive picture communication boards.',
      'Prompt icon touching paired with verbal modeling.',
      'Transition from single icons to full sentence strings.'
    ],
    relatedBehaviors: ['AAC Devices', 'Symbolic Communication'],
    thumbnailBg: 'bg-gradient-to-br from-rose-500 to-pink-700',
    views: '4.1k',
    author: 'Dr. Sarah Jenkins, CCC-SLP'
  },
  {
    id: 'vid-11',
    title: 'Conversational Turn-Taking & Pause Management',
    category: 'Social Interaction',
    duration: '05:45',
    difficulty: 'Beginner',
    description: 'Guiding learners through interactive back-and-forth dialogue exchanges.',
    objectives: [
      'Use a physical turn-taking token (talking stick).',
      'Enforce 3-second wait times before speaking.',
      'Acknowledge partner responses with head nods.'
    ],
    relatedBehaviors: ['Turn Taking', 'Pragmatics', 'Active Listening'],
    thumbnailBg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    views: '1.6k',
    author: 'Laura Adams, MS, CCC-SLP'
  },
  {
    id: 'vid-12',
    title: 'Recognizing & Responding to Emotional Cues',
    category: 'Social Interaction',
    duration: '06:30',
    difficulty: 'Intermediate',
    description: 'Teaching learners to identify happy, sad, or confused facial expressions in peer groups.',
    objectives: [
      'Utilize emotion photo flashcards during interactions.',
      'Practice empathetic response phrases.',
      'Roleplay common playground and group scenarios.'
    ],
    relatedBehaviors: ['Emotion Recognition', 'Empathy', 'Social Response'],
    thumbnailBg: 'bg-gradient-to-br from-sky-500 to-indigo-600',
    views: '1.1k',
    author: 'Dr. Emily Chen, Clinical Director'
  },
  {
    id: 'vid-13',
    title: 'Initiating Conversations with Peers',
    category: 'Social Interaction',
    duration: '04:50',
    difficulty: 'Intermediate',
    description: 'Step-by-step strategies for teaching learners how to greet peers and start shared play activities.',
    objectives: [
      'Practice 3 standard conversation starters.',
      'Pair greetings with appropriate personal space distance.',
      'Reinforce successful social approaches.'
    ],
    relatedBehaviors: ['Social Initiation', 'Peer Interaction'],
    thumbnailBg: 'bg-gradient-to-br from-blue-500 to-emerald-600',
    views: '2.3k',
    author: 'Robert Vance, Lead Speech Pathologist'
  },
  {
    id: 'vid-14',
    title: 'Overcoming Word Retrieval Hesitation in Group Therapy',
    category: 'Expressive Language',
    duration: '07:10',
    difficulty: 'Advanced',
    description: 'Group dynamics and supportive techniques when patients experience sudden word-finding blocks.',
    objectives: [
      'Teach circumlocution strategies (describing shape, color, or function).',
      'Create a low-pressure group response environment.',
      'Use peer scaffolding effectively.'
    ],
    relatedBehaviors: ['Group Therapy', 'Word Finding', 'Circumlocution'],
    thumbnailBg: 'bg-gradient-to-br from-purple-600 to-blue-700',
    views: '970',
    author: 'Rachel Taylor, Neurological SLP'
  },
  {
    id: 'vid-15',
    title: 'Joint Attention Calibration in Multi-Person Settings',
    category: 'Joint Attention',
    duration: '05:50',
    difficulty: 'Advanced',
    description: 'Managing shared focus when 3 or more participants are engaged in a shared task.',
    objectives: [
      'Maintain central focal object positioning.',
      'Distribute gaze prompts evenly across group participants.',
      'Track multi-directional joint attention switches.'
    ],
    relatedBehaviors: ['Group Focus', 'Triadic Attention'],
    thumbnailBg: 'bg-gradient-to-br from-teal-600 to-indigo-700',
    views: '760',
    author: 'Mark Davis, Pediatric SLP'
  }
];
