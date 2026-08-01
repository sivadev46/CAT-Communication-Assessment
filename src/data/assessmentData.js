export const activePatientInfo = {
  id: 'PAT-2026-084',
  name: 'Eleanor Vance',
  age: '68 yrs',
  gender: 'Female',
  diagnosis: 'Post-Stroke Aphasia & Apraxia of Speech',
  assessmentDate: 'July 31, 2026',
  clinician: 'Dr. Sarah Jenkins, SLP',
  initials: 'EV',
  avatarBg: 'bg-blue-100 text-blue-700',
};

export const assessmentCategories = [
  {
    id: 'eye-contact',
    name: '1. Eye Contact',
    description: 'Direct gaze, tracking, and visual engagement behaviors',
    items: [
      {
        id: 'ec-1',
        name: 'Maintains direct eye contact during greetings',
        description: 'Establishes and holds eye contact for at least 3 seconds when greeted by the SLP.',
      },
      {
        id: 'ec-2',
        name: 'Tracks speaker during verbal interaction',
        description: 'Visually follows the clinician while listening to verbal prompts or instruction.',
      },
      {
        id: 'ec-3',
        name: 'Initiates eye contact to request assistance',
        description: 'Looks directly at the therapist or caregiver when seeking help or clarification.',
      },
      {
        id: 'ec-4',
        name: 'Shifts gaze between objects and clinician',
        description: 'Displays natural gaze shifting between presented stimuli and the speaker.',
      },
    ],
  },
  {
    id: 'joint-attention',
    name: '2. Joint Attention',
    description: 'Shared focus on objects, tasks, or environmental events',
    items: [
      {
        id: 'ja-1',
        name: 'Responds to clinician pointing gesture',
        description: 'Looks at an indicated object when the clinician points and names it.',
      },
      {
        id: 'ja-2',
        name: 'Initiates shared attention by pointing or showing',
        description: 'Points to or holds up an item to share interest with the observer.',
      },
      {
        id: 'ja-3',
        name: 'Follows clinician gaze direction',
        description: 'Turns head/eyes toward where the therapist looks without explicit verbal cues.',
      },
      {
        id: 'ja-4',
        name: 'Sustains dual focus during structured activities',
        description: 'Maintains attention on shared picture cards or assessment materials.',
      },
    ],
  },
  {
    id: 'receptive-language',
    name: '3. Receptive Language',
    description: 'Understanding spoken words, instructions, and concepts',
    items: [
      {
        id: 'rl-1',
        name: 'Follows 1-step simple verbal commands',
        description: 'Executes single actions (e.g., "Raise your hand", "Point to the key").',
      },
      {
        id: 'rl-2',
        name: 'Follows 2-step sequential instructions',
        description: 'Performs multi-step tasks (e.g., "Pick up the pen and place it in the cup").',
      },
      {
        id: 'rl-3',
        name: 'Identifies common objects upon naming',
        description: 'Correctly selects named objects or pictures from a field of 4 choices.',
      },
      {
        id: 'rl-4',
        name: 'Comprehends basic yes/no questions',
        description: 'Accurately responds to factual yes/no queries regarding identity or environment.',
      },
    ],
  },
  {
    id: 'expressive-language',
    name: '4. Expressive Language',
    description: 'Verbal, gestural, or modal expression of thoughts and needs',
    items: [
      {
        id: 'el-1',
        name: 'Produces clear single-word responses',
        description: 'Names common everyday items accurately upon visual presentation.',
      },
      {
        id: 'el-2',
        name: 'Combines words into meaningful phrases',
        description: 'Forms 2-4 word functional phrases to express immediate needs or ideas.',
      },
      {
        id: 'el-3',
        name: 'Uses symbolic gestures effectively',
        description: 'Employs head nods, waving, pointing, or custom gestures when words fail.',
      },
      {
        id: 'el-4',
        name: 'Demonstrates motor speech precision (articulation)',
        description: 'Articulates phonemes clearly without severe oral-motor struggle.',
      },
      {
        id: 'el-5',
        name: 'Initiates spontaneous verbal turn-taking',
        description: 'Offers comments or answers without needing repetitive vocal prompting.',
      },
    ],
  },
  {
    id: 'social-interaction',
    name: '5. Social Interaction',
    description: 'Pragmatics, conversational turn-taking, and affective response',
    items: [
      {
        id: 'si-1',
        name: 'Responds appropriately to social greetings & farewells',
        description: 'Returns "Hello" and "Goodbye" verbally, vocally, or through gesture.',
      },
      {
        id: 'si-2',
        name: 'Demonstrates turn-taking in communication exchanges',
        description: 'Waits for clinician to finish speaking before responding.',
      },
      {
        id: 'si-3',
        name: 'Displays appropriate facial affect during conversation',
        description: 'Matches facial expressions (smiling, concern) to the emotional context.',
      },
      {
        id: 'si-4',
        name: 'Tolerates communicative frustration or corrections',
        description: 'Maintains composure and tries again when misunderstood or corrected.',
      },
    ],
  },
];
