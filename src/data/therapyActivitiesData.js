import placeholderSvg from '../assets/placeholder.svg';
import act01Img from '../assets/activities/Maintains direct eye contact during greetings.png';
import act02Img from '../assets/activities/Tracks speaker during verbal interaction.png';
import act03Img from '../assets/activities/Initiates Eye contact to request assisstance.png';
import act04Img from '../assets/activities/Shifts gaze between objects and clinician.png';
import act05Img from '../assets/activities/Responds to clinician pointing gesture.png';
import act06Img from '../assets/activities/Initiates shared attention by pointing or showing.png';
import act07Img from '../assets/activities/Follows clinician gaze direction.png';
import act08Img from '../assets/activities/Sustains dual focus during structured activities.png';
import act09Img from '../assets/activities/Follow 1 step simple verbal command.png';
import act10Img from '../assets/activities/Follow 2 step sequential instructions.png';
import act11Img from '../assets/activities/Identify common objects.png';
import act12Img from '../assets/activities/Comprehends yes no.png';
import act13Img from '../assets/activities/Produces clear single word responses.png';
import act14Img from '../assets/activities/Combines words to sentences.png';
import act15Img from '../assets/activities/Use gestures.png';
import act16Img from '../assets/activities/Articulation.png';
import act17Img from '../assets/activities/Initiates turn taking.png';
import act18Img from '../assets/activities/Responds to social greeting.png';
import act19Img from '../assets/activities/Demostrates turn taking.png';
import act20Img from '../assets/activities/Display appropriate facial expression.png';
import act21Img from '../assets/activities/Tolerate communication frustration.png';

export const therapyCategories = [
  'Eye Contact',
  'Joint Attention',
  'Receptive Language',
  'Expressive Language',
  'Social Interaction'
];

export const difficultyLevels = [
  'Beginner',
  'Intermediate',
  'Advanced'
];

export const therapyActivities = [
  // ==================== EYE CONTACT ====================
  {
    id: 'act-01',
    title: 'Maintains direct eye contact during greetings',
    category: 'Eye Contact',
    difficulty: 'Beginner',
    duration: '5 mins',
    description: 'Use physical proximity, eye-level positioning, and highly motivating greeting toys to establish direct gaze.',
    goal: 'Increase direct eye contact duration to at least 2 seconds during natural greeting exchanges.',
    instructions: [
      'Position yourself at your child\'s exact eye level before speaking.',
      'Hold a favorite toy or item near your eyes to draw focus.',
      'Say a warm greeting (e.g., "Hello [Name]!") and wait for them to look at your face.',
      'Deliver immediate positive reinforcement when eye contact is established.'
    ],
    parentTips: [
      'Avoid pulling or forcing your child\'s head toward you; let them initiate the look.',
      'Use toys that make a gentle noise if your child is primarily responsive to auditory cues.'
    ],
    thingsToRemember: [
      'Gaze should feel natural and unforced.',
      'Even brief looks (1 second) are a great starting point for beginners.'
    ],
    relatedAssessment: 'Maintains direct eye contact during greetings',
    imagePath: act01Img
  },
  {
    id: 'act-02',
    title: 'Tracks speaker during verbal interaction',
    category: 'Eye Contact',
    difficulty: 'Intermediate',
    duration: '5-10 mins',
    description: 'Practice visual tracking of the parent\'s face while the parent speaks or sings simple melodies.',
    goal: 'Maintain visual attention on the speaker\'s face for the duration of a short sentence or phrase.',
    instructions: [
      'Sit facing your child in a quiet room with minimal visual distractions.',
      'Start speaking in an animated voice or singing a familiar song.',
      'Move your head slightly side to side to encourage tracking.',
      'Pause singing or speaking if they look away, resuming only when they track back.'
    ],
    parentTips: [
      'Exaggerate your lip movements and expressions to make your face more visually engaging.',
      'Keep visual background distractions (TV, tablets) turned off.'
    ],
    thingsToRemember: [
      'Look for signs of visual fatigue or sensory overload (blinking, rubbing eyes).',
      'Give brief breaks between tracking trials.'
    ],
    relatedAssessment: 'Tracks speaker during verbal interaction',
    imagePath: act02Img
  },
  {
    id: 'act-03',
    title: 'Initiates eye contact to request assistance',
    category: 'Eye Contact',
    difficulty: 'Intermediate',
    duration: '5-10 mins',
    description: 'Create communication opportunities by placing desired items in hard-to-open containers.',
    goal: 'Prompt the child to make eye contact to request help rather than using physical pulling or crying.',
    instructions: [
      'Place a highly desired toy inside a clear, tightly closed jar.',
      'Hand the jar to your child and wait for them to attempt to open it.',
      'When they cannot open it, wait for them to look up at your face for help.',
      'As soon as they make eye contact, say "Open!" and immediately open the jar.'
    ],
    parentTips: [
      'Be patient; wait up to 10 seconds for the gaze to shift to you before prompting.',
      'If needed, gently touch your own chin to prompt them to look up.'
    ],
    thingsToRemember: [
      'This activity is about building independence in social requesting.',
      'Reinforce the look instantly to build the connection between gaze and reward.'
    ],
    relatedAssessment: 'Initiates eye contact to request assistance',
    imagePath: act03Img
  },
  {
    id: 'act-04',
    title: 'Shifts gaze between objects and clinician',
    category: 'Eye Contact',
    difficulty: 'Advanced',
    duration: '10 mins',
    description: 'Practice three-way (triadic) gaze shifts between a motivating object, the parent, and back to the object.',
    goal: 'Establish fluid triadic eye gaze patterns during interactive play.',
    instructions: [
      'Sit with your child and activate an exciting toy (e.g., a wind-up toy).',
      'Hold the toy and say "Look!" pointing to it.',
      'Wait for the child to look at the toy, then look up at you, and then back to the toy.',
      'Model this gaze shift yourself and celebrate when they replicate the pattern.'
    ],
    parentTips: [
      'Use toys that have a clear action/stop cycle, like bubbles or wind-up cars.',
      'Say "Wow!" or show surprised expressions to draw their look back to your face.'
    ],
    thingsToRemember: [
      'Triadic gaze shifts are the foundation of joint attention and social communication.',
      'Ensure the object is physically aligned to make the shift comfortable.'
    ],
    relatedAssessment: 'Shifts gaze between objects and clinician',
    imagePath: act04Img
  },

  // ==================== JOINT ATTENTION ====================
  {
    id: 'act-05',
    title: 'Responds to clinician pointing gesture',
    category: 'Joint Attention',
    difficulty: 'Beginner',
    duration: '5 mins',
    description: 'Encourage your child to follow your index finger point to locate motivating items in the room.',
    goal: 'Accurately look at an object located at least 5 feet away in response to a pointing gesture.',
    instructions: [
      'Sit next to your child and ensure they are looking at you.',
      'Say "Look at the [Item]!" while pointing directly at an object across the room.',
      'Gently nudge their attention toward the target if they do not follow the point.',
      'Celebrate and reward them immediately when they locate the correct object.'
    ],
    parentTips: [
      'Start with objects that are close (1-2 feet) and gradually increase distance.',
      'Use high-interest objects (e.g., balloons, light-up toys) as targets.'
    ],
    thingsToRemember: [
      'Ensure your hand is clearly in their field of vision when you start pointing.',
      'Pointing is a critical milestone for receptive communication.'
    ],
    relatedAssessment: 'Responds to clinician pointing gesture',
    imagePath: act05Img
  },
  {
    id: 'act-06',
    title: 'Initiates shared attention by pointing or showing',
    category: 'Joint Attention',
    difficulty: 'Intermediate',
    duration: '10 mins',
    description: 'Create setups that surprise or interest your child, prompting them to point and share the experience.',
    goal: 'Spontaneously point or show an object to share interest, accompanied by eye contact.',
    instructions: [
      'Place a new or unusual item (like a funny hat or balloon) in a visible spot.',
      'Act busy and wait for your child to notice the item.',
      'Wait for them to point to it or bring it to you to show you.',
      'Respond with high enthusiasm: "Oh look! You found the balloon!"'
    ],
    parentTips: [
      'Do not jump to label items immediately. Give your child time to show you first.',
      'Acknowledge any pointing attempt with immediate verbal validation.'
    ],
    thingsToRemember: [
      'Initiating is harder than responding. Be patient and wait for the child to lead.',
      'Praise the combination of pointing and looking at you.'
    ],
    relatedAssessment: 'Initiates shared attention by pointing or showing',
    imagePath: act06Img
  },
  {
    id: 'act-07',
    title: 'Follows clinician gaze direction',
    category: 'Joint Attention',
    difficulty: 'Intermediate',
    duration: '5-10 mins',
    description: 'Practice gaze-following without finger points or verbal naming cues.',
    goal: 'Follow the parent\'s head turn and gaze direction to look at a shared target.',
    instructions: [
      'Sit directly opposite your child and establish eye contact.',
      'Turn your head dramatically and look at a specific toy next to you.',
      'Hold your gaze on the toy without pointing or speaking.',
      'Wait for your child to turn their head and look at the same toy.'
    ],
    parentTips: [
      'Start with very obvious, slow head turns.',
      'Place a toy that makes sound or moves in the target direction to make it easier initially.'
    ],
    thingsToRemember: [
      'This requires the child to understand that your eyes are looking at something specific.',
      'Practice in a clutter-free environment to avoid confusion.'
    ],
    relatedAssessment: 'Follows clinician gaze direction',
    imagePath: act07Img
  },
  {
    id: 'act-08',
    title: 'Sustains dual focus during structured activities',
    category: 'Joint Attention',
    difficulty: 'Advanced',
    duration: '10-15 mins',
    description: 'Engage in collaborative, back-and-forth building or puzzle activities requiring shared focus.',
    goal: 'Sustain shared attention on a structured task for at least 5 minutes with multiple interactions.',
    instructions: [
      'Set up a simple block building set or puzzle between you.',
      'Take turns placing blocks or pieces, commenting on each step.',
      'Use phrases like "My turn," "Your turn," and "Look what we made!"',
      'Encourage your child to look at the progress of the structure and at you.'
    ],
    parentTips: [
      'Keep the task simple enough so the child does not get frustrated with the motor demands.',
      'Praise their cooperation and shared focus frequently.'
    ],
    thingsToRemember: [
      'This builds working memory, turn-taking, and shared goals.',
      'Collaborative play is the peak of early joint attention development.'
    ],
    relatedAssessment: 'Sustains dual focus during structured activities',
    imagePath: act08Img
  },

  // ==================== RECEPTIVE LANGUAGE ====================
  {
    id: 'act-09',
    title: 'Follows 1-step simple verbal commands',
    category: 'Receptive Language',
    difficulty: 'Beginner',
    duration: '5 mins',
    description: 'Practice simple, actionable single-step commands in play contexts.',
    goal: 'Respond accurately to 1-step commands without physical prompts.',
    instructions: [
      'Give a simple command in a clear, friendly voice (e.g., "Give me ball").',
      'Wait 3-5 seconds for your child to process and execute.',
      'If they do not respond, model the action or use a gentle gesture.',
      'Provide praise: "Good job giving me the ball!" when done.'
    ],
    parentTips: [
      'Keep verbal commands short and clear. Avoid burying the command in long sentences.',
      'Use commands that are highly relevant to their current play (e.g., "Roll it," "Sit down").'
    ],
    thingsToRemember: [
      'Ensure you have their attention before giving the instruction.',
      'Avoid repeating the command multiple times in rapid succession.'
    ],
    relatedAssessment: 'Follows 1-step simple verbal commands',
    imagePath: act09Img
  },
  {
    id: 'act-10',
    title: 'Follows 2-step sequential instructions',
    category: 'Receptive Language',
    difficulty: 'Intermediate',
    duration: '5-10 mins',
    description: 'Build working memory by joining two simple commands in sequence.',
    goal: 'Execute a 2-step command (e.g., "Pick up block and put in box") in the correct order.',
    instructions: [
      'Get your child\'s full attention.',
      'State the two steps clearly: "Get the spoon, then put it in the bowl."',
      'Allow time for the child to process and perform both actions.',
      'Praise them specifically for completing both steps in the right order.'
    ],
    parentTips: [
      'Use the words "first" and "then" to make the sequence clear (e.g., "First get the book, then give it to Daddy").',
      'If they forget the second step, gently prompt them: "What is next?"'
    ],
    thingsToRemember: [
      'Processing two commands takes significantly more cognitive effort.',
      'Celebrate partial successes and scaffold down if they get stuck.'
    ],
    relatedAssessment: 'Follows 2-step sequential instructions',
    imagePath: act10Img
  },
  {
    id: 'act-11',
    title: 'Identifies common objects upon naming',
    category: 'Receptive Language',
    difficulty: 'Beginner',
    duration: '5-10 mins',
    description: 'Select and touch or point to common household objects or animals from an array of options.',
    goal: 'Identify the named object correctly from a field of 3 items.',
    instructions: [
      'Place 3 common items (e.g., cup, shoe, ball) on a table in front of your child.',
      'Say, "Show me the cup" or "Touch the ball."',
      'Wait for the child to point to or pick up the correct item.',
      'Praise them: "Yes! That is the cup!" and let them play with it.'
    ],
    parentTips: [
      'Start with a field of 2 objects if 3 is too challenging.',
      'Use items they interact with daily to make identification relevant.'
    ],
    thingsToRemember: [
      'Ensure the items are distinct in appearance and category to start.',
      'This activity checks vocabulary comprehension without requiring speech.'
    ],
    relatedAssessment: 'Identifies common objects upon naming',
    imagePath: act11Img
  },
  {
    id: 'act-12',
    title: 'Comprehends basic yes/no questions',
    category: 'Receptive Language',
    difficulty: 'Intermediate',
    duration: '5 mins',
    description: 'Practice answering clear yes/no questions using words, head nods, or head shakes.',
    goal: 'Correctly answer simple yes/no questions about immediate desires or concrete objects.',
    instructions: [
      'Hold up a preferred item (e.g., a cookie) and ask, "Do you want cookie?"',
      'Encourage a nod for "yes" or shake for "no".',
      'Ask concrete questions about objects, e.g., "Is this a shoe?" while holding a shoe.',
      'Reinforce correct answers with positive confirmation.'
    ],
    parentTips: [
      'Accept head nods and shakes as valid responses alongside spoken words.',
      'Start with questions where the child has a very strong preference (e.g., favorite foods).'
    ],
    thingsToRemember: [
      'Abstract yes/no questions (e.g., "Are you happy?") are much harder than concrete ones.',
      'Model head nods/shakes alongside your own verbal yes/no answers.'
    ],
    relatedAssessment: 'Comprehends basic yes/no questions',
    imagePath: act12Img
  },

  // ==================== EXPRESSIVE LANGUAGE ====================
  {
    id: 'act-13',
    title: 'Produces clear single-word responses',
    category: 'Expressive Language',
    difficulty: 'Beginner',
    duration: '5-10 mins',
    description: 'Prompt single-word utterances by using motivating pauses and choice selections.',
    goal: 'Produce a single target word spontaneously or in response to a choice.',
    instructions: [
      'Hold up two items (e.g., apple or banana) and ask, "What do you want?"',
      'Wait for your child to vocalize a single word representing their choice.',
      'If they point without speaking, model the word: "Apple," and wait for them to attempt it.',
      'Immediately hand over the chosen item upon word production.'
    ],
    parentTips: [
      'Celebrate any vocal approximation of the target word; clarity improves with practice.',
      'Use high-frequency target words like "more," "go," "stop," "up," or object names.'
    ],
    thingsToRemember: [
      'Create a need for communication; do not anticipate every need without giving them a chance to speak.',
      'Keep it pressure-free. If they struggle, model and move on.'
    ],
    relatedAssessment: 'Produces clear single-word responses',
    imagePath: act13Img
  },
  {
    id: 'act-14',
    title: 'Combines words into meaningful phrases',
    category: 'Expressive Language',
    difficulty: 'Intermediate',
    duration: '10 mins',
    description: 'Encourage your child to expand single words into 2-3 word phrases during play.',
    goal: 'Generate 2-3 word phrases (e.g., "More bubble," "Big car," "Want milk") to communicate.',
    instructions: [
      'When your child says a single word (e.g., "car"), repeat it and add a word: "Big car!"',
      'Prompt them to repeat the expanded phrase back to you.',
      'Use carrier phrases during snack time: "I want..." or "More..."',
      'Provide the reward immediately after they attempt the phrase expansion.'
    ],
    parentTips: [
      'Use visual aids like "sentence strips" (drawings representing: [I want] [bubble]).',
      'Focus on high-utility action words combined with nouns.'
    ],
    thingsToRemember: [
      'Praise the effort to combine words, even if articulation is not perfect.',
      'This transition from single words to phrases is key for functional speech.'
    ],
    relatedAssessment: 'Combines words into meaningful phrases',
    imagePath: act14Img
  },
  {
    id: 'act-15',
    title: 'Uses symbolic gestures effectively',
    category: 'Expressive Language',
    difficulty: 'Beginner',
    duration: '5 mins',
    description: 'Integrate functional gestures (pointing, waving, open hand, shaking head) into daily routines.',
    goal: 'Spontaneously use at least 2 functional gestures to communicate needs or greetings.',
    instructions: [
      'Model waving "bye-bye" whenever someone leaves the room.',
      'Model pointing to items out of reach while asking "Do you want that?"',
      'Teach the "all done" gesture (hands out/waving) at the end of meals.',
      'Wait for the child to copy or initiate these gestures, and respond immediately.'
    ],
    parentTips: [
      'Gestures help reduce frustration for children who are still developing speech.',
      'Always pair the physical gesture with the spoken word (e.g., wave and say "bye-bye").'
    ],
    thingsToRemember: [
      'Gestural communication is a natural bridge to spoken language.',
      'Ensure everyone in the household uses the same gestures consistently.'
    ],
    relatedAssessment: 'Uses symbolic gestures effectively',
    imagePath: act15Img
  },
  {
    id: 'act-16',
    title: 'Demonstrates motor speech precision (articulation)',
    category: 'Expressive Language',
    difficulty: 'Intermediate',
    duration: '5-10 mins',
    description: 'Practice clear sound production and sound imitation using mirror play and mouth modeling.',
    goal: 'Accurately imitate target sounds or word syllables with correct mouth positioning.',
    instructions: [
      'Sit with your child in front of a mirror so you can both see your faces.',
      'Model a simple sound with exaggerated lip/tongue movement (e.g., "Ba-ba," "Ma-ma," "Poo-poo").',
      'Encourage your child to look at your mouth, then look at their own mouth and make the sound.',
      'Make it fun by making silly faces and motor speech sounds.'
    ],
    parentTips: [
      'Work on sounds in a developmental order (e.g., P, B, M, W are easier than R, S, L).',
      'Do not constantly correct pronunciation; focus on modeling the correct sound clearly.'
    ],
    thingsToRemember: [
      'Praise the placement of the lips and tongue even if the sound is off.',
      'Keep sessions brief and play-based.'
    ],
    relatedAssessment: 'Demonstrates motor speech precision (articulation)',
    imagePath: act16Img
  },
  {
    id: 'act-17',
    title: 'Initiates spontaneous verbal turn-taking',
    category: 'Expressive Language',
    difficulty: 'Advanced',
    duration: '10 mins',
    description: 'Engage in conversational games where the child must initiate their turn to keep the play going.',
    goal: 'Spontaneously initiate a verbal exchange or question during a interactive play sequence.',
    instructions: [
      'Start a repetitive verbal play routine (e.g., "Ready, set..." and wait).',
      'Wait for your child to fill in the blank ("Go!") to initiate the action.',
      'Ask open-ended questions during play and wait for a response.',
      'Encourage them to ask you questions, like "Where is it?" during hide-and-seek.'
    ],
    parentTips: [
      'Wait in silence! Giving your child "thinking time" (up to 8 seconds) is crucial.',
      'Show high engagement when they start a turn.'
    ],
    thingsToRemember: [
      'Spontaneous initiation requires confidence. Keep the atmosphere relaxed and encouraging.',
      'Do not jump in too quickly to fill the silence.'
    ],
    relatedAssessment: 'Initiates spontaneous verbal turn-taking',
    imagePath: act17Img
  },

  // ==================== SOCIAL INTERACTION ====================
  {
    id: 'act-18',
    title: 'Responds appropriately to social greetings & farewells',
    category: 'Social Interaction',
    difficulty: 'Beginner',
    duration: '5 mins',
    description: 'Practice returning greetings and goodbyes using words or gestures during family transitions.',
    goal: 'Acknowledge and respond to "hello" and "bye-bye" from family members 80% of the time.',
    instructions: [
      'When a family member enters the room, prompt them to say "Hi [Name]!"',
      'Gently encourage your child to respond by waving or saying "Hi."',
      'Do the same when someone leaves the house, modeling the goodbye wave.',
      'Praise the social connection: "That was so nice to say hello!"'
    ],
    parentTips: [
      'Use high-energy, friendly tones for greetings and warm, calm tones for farewells.',
      'Practice with favorite dolls or action figures if real-life transitions are too hectic.'
    ],
    thingsToRemember: [
      'Social greetings are the building blocks of group entry and acceptance.',
      'Be consistent across all daily departures and arrivals.'
    ],
    relatedAssessment: 'Responds appropriately to social greetings & farewells',
    imagePath: act18Img
  },
  {
    id: 'act-19',
    title: 'Demonstrates turn-taking in communication exchanges',
    category: 'Social Interaction',
    difficulty: 'Intermediate',
    duration: '10 mins',
    description: 'Practice interactive conversational turn-taking using a physical token like a talking ball.',
    goal: 'Perform at least 3 back-and-forth verbal/non-verbal turns in a sequence.',
    instructions: [
      'Sit in a circle or across from each other with a soft ball.',
      'Roll the ball to your child and ask a simple question: "What toy should we play with?"',
      'Your child rolls the ball back and answers. Take turns passing the ball and speaking.',
      'Explain: "Only the person holding the ball talks."'
    ],
    parentTips: [
      'The ball acts as a concrete visual representation of whose turn it is.',
      'Keep your statements short so the turn transitions quickly.'
    ],
    thingsToRemember: [
      'This teaches active listening and helps control conversational interruptions.',
      'It is excellent preparation for classroom circle-time activities.'
    ],
    relatedAssessment: 'Demonstrates turn-taking in communication exchanges',
    imagePath: act19Img
  },
  {
    id: 'act-20',
    title: 'Displays appropriate facial affect during conversation',
    category: 'Social Interaction',
    difficulty: 'Intermediate',
    duration: '10 mins',
    description: 'Practice matching facial expressions to emotions and conversation topics using mirror and card games.',
    goal: 'Display a facial expression that matches the emotional tone of the discussion.',
    instructions: [
      'Show cards with emotional faces (happy, sad, surprised).',
      'Practice making those faces together in a mirror.',
      'Tell a simple story: "The puppy is lost," and model a sad face. Ask your child to show a sad face.',
      'Then say, "We found the puppy!" and model a big happy smile.'
    ],
    parentTips: [
      'Exaggerate your expressions to make them easy for your child to read and copy.',
      'Praise them: "Look at your happy smile! You look so happy!"'
    ],
    thingsToRemember: [
      'Facial affect is critical for showing empathy and understanding in conversations.',
      'Avoid pressure; make it a fun, dramatic roleplay game.'
    ],
    relatedAssessment: 'Displays appropriate facial affect during conversation',
    imagePath: act20Img
  },
  {
    id: 'act-21',
    title: 'Tolerates communicative frustration or corrections',
    category: 'Social Interaction',
    difficulty: 'Advanced',
    duration: '10 mins',
    description: 'Help your child build coping mechanisms when they are misunderstood or corrected.',
    goal: 'Remain calm and attempt a repair strategy when they experience communicative failure.',
    instructions: [
      'During play, intentionally misunderstand a request: "Oh, did you want the blue block? (when they asked for red)."',
      'If they get frustrated, model a calm breath and say, "Let\'s try again. Show me or say it slowly."',
      'Guide them to use a gesture, pointing, or slow speech to clarify.',
      'Celebrate their calmness: "Thank you for showing me! I understand now."'
    ],
    parentTips: [
      'Validate their frustration first: "I know it is hard when I don\'t understand."',
      'Never mock or push the child past their breaking point; keep it a supportive exercise.'
    ],
    thingsToRemember: [
      'Developing emotional regulation during communication breakdowns is a high-level skill.',
      'Keep the task low-stakes so they can practice coping successfully.'
    ],
    relatedAssessment: 'Tolerates communicative frustration or corrections',
    imagePath: act21Img
  }
];
