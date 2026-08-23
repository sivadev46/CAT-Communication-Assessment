import placeholderSvg from '../assets/placeholder.svg';
import act01Img from '../assets/activities/Startle response to loud sudden noises.png';
import act02Img from '../assets/activities/Activity arrested when approached by sound.png';
import act03Img from '../assets/activities/Often Quieted by Familiar Friendly Voice.png';
import act04Img from '../assets/activities/Frequently Gives Direction to Other Voices.png';
import act05Img from '../assets/activities/Appears to Listen to Speaker.png';
import act06Img from '../assets/activities/Often Looks at Speaker and Responds by Smiling.png';
import act07Img from '../assets/activities/Response to Playful Activities.png';
import act08Img from '../assets/activities/Responds to Speech by Looking Directly at the Speaker.png';
import act09Img from '../assets/activities/Frequently Watches Lips and Mouth of Speaker.png';
import act10Img from '../assets/activities/Frequent Crying.png';
import act11Img from '../assets/activities/Regularly Localizes Speaker with Eyes.png';
import act12Img from '../assets/activities/Frequent Crying2.png';
import act13Img from '../assets/activities/Random Vocalization Rather than Crying.png';
import act14Img from '../assets/activities/Vowel-Like Sounds Predominate.png';
import act15Img from '../assets/activities/Has a Special Cry for Hunger.png';
import act16Img from '../assets/activities/Develops Vocal Signs at Pleasure.png';
import act17Img from '../assets/activities/Occasionally Responds to Sound Stimulation.png';
import act18Img from '../assets/activities/Vowel Like Sounds Predominate.png';
import act19Img from '../assets/activities/Expresses Pleasure Vocally.png';

export const therapyCategories = [
  'Auditory Response',
  'Auditory Attention',
  'Social Communication',
  'Social Interaction',
  'Visual Attention',
  'Emotional Expression',
  'Vocal Communication'
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
    title: 'Startle response to sudden loud noises',
    category: 'Auditory Response',
    difficulty: 'Beginner',
    duration: '5 mins',
    description: 'Observe and support your child’s response to sudden, unexpected sounds in a calm and controlled setting.',
    goal: 'Increase the child’s ability to remain calm and gradually recover after hearing a sudden loud noise.',
    instructions: [
      'Choose a quiet and familiar environment where your child feels comfortable.',
      'Introduce a mild, unexpected sound from a safe distance and observe your child’s response.',
      'Allow your child time to recover without immediately repeating the sound.',
      'Use a calm voice and reassuring presence to help your child feel safe.',
      'Gradually repeat the activity with different everyday sounds while keeping the intensity comfortable for your child.'
    ],
    parentTips: [
      'Start with gentle sounds and avoid intentionally frightening your child.',
      'Give your child enough space and time to recover after an unexpected sound.',
      'Praise calm recovery and avoid forcing your child to continue if they become distressed.'
    ],
    thingsToRemember: [
      'Every child responds differently to sudden sounds.',
      'The goal is to build comfort and coping skills gradually, not to eliminate the startle response completely.',
      'Stop the activity if your child becomes significantly distressed.'
    ],
    relatedAssessment: 'Startle response to sudden loud noises',
    imagePath: act01Img
  },
  {
    id: 'act-02',
    title: 'Activity arrested when approached by sound',
    category: 'Auditory Response',
    difficulty: 'Intermediate',
    duration: '5-10 mins',
    description: 'Observe whether your child pauses or stops an ongoing activity when they hear a sound approaching from nearby.',
    goal: 'Increase the child’s ability to notice and respond appropriately when an unexpected or approaching sound occurs.',
    instructions: [
      'Choose a familiar activity your child enjoys in a quiet and comfortable room.',
      'While your child is engaged in the activity, make a gentle sound from a short distance away.',
      'Observe whether your child pauses, stops, turns toward the sound, or otherwise acknowledges it.',
      'Allow your child time to process the sound before repeating the activity.',
      'Gradually introduce different everyday sounds while keeping the environment comfortable.'
    ],
    parentTips: [
      'Begin with soft and familiar sounds before introducing less familiar sounds.',
      'Give your child enough time to notice and process the sound without repeating it immediately.',
      'Use calm encouragement when your child notices or responds to the sound.'
    ],
    thingsToRemember: [
      'Children may respond to sounds in different ways, such as pausing, turning, or looking toward the source.',
      'Avoid deliberately creating very loud or frightening sounds.',
      'Keep practice sessions short and provide breaks when needed.'
    ],
    relatedAssessment: 'Activity arrested when approached by sound',
    imagePath: act02Img
  },
  {
    id: 'act-03',
    title: 'Often Quieted by Familiar Friendly Voice',
    category: 'Auditory Response',
    difficulty: 'Intermediate',
    duration: '5-10 mins',
    description: 'Observe and encourage your child’s ability to calm and settle when they hear a familiar, friendly voice.',
    goal: 'Increase the child’s ability to recognize and respond calmly to a familiar caregiver’s voice during moments of mild distress or agitation.',
    instructions: [
      'Choose a quiet and comfortable environment where your child feels secure.',
      'When your child becomes mildly unsettled, approach calmly and speak using a familiar, gentle voice.',
      'Use the child’s name and short, reassuring phrases such as "I am here" or "You are safe."',
      'Pause and allow your child time to listen and respond to your voice.',
      'Repeat the activity during different everyday situations while keeping your voice calm and consistent.'
    ],
    parentTips: [
      'Use a warm and familiar tone rather than speaking loudly or urgently.',
      'Keep your words short and simple so your child can focus on the sound of your voice.',
      'Give your child enough time to process your voice before repeating the prompt.'
    ],
    thingsToRemember: [
      'Some children may respond by becoming quieter, looking toward you, relaxing, or returning to an activity.',
      'Do not force a response; allow your child to respond at their own pace.',
      'Keep the activity positive and stop if your child becomes more distressed.'
    ],
    relatedAssessment: 'Often Quieted by Familiar Friendly Voice',
    imagePath: act03Img
  },
  {
    id: 'act-04',
    title: 'Frequently Gives Direction to Other Voices',
    category: 'Auditory Attention',
    difficulty: 'Advanced',
    duration: '10 mins',
    description: 'Practice noticing and orienting toward different voices by observing where the sound comes from and shifting attention between speakers.',
    goal: 'Improve the child’s ability to recognize different voices and direct their attention toward the person who is speaking.',
    instructions: [
      'Sit with your child in a quiet room with another familiar person nearby.',
      'Have one person speak to the child using a calm and familiar voice.',
      'Allow the child time to listen and observe whether they turn their head, eyes, or body toward the speaker.',
      'Have the second person speak from a different position and observe whether the child shifts attention toward the new voice.',
      'Repeat the activity using short phrases and different positions around the child.'
    ],
    parentTips: [
      'Begin with familiar voices before introducing less familiar speakers.',
      'Keep background noise low so your child can focus on the voices.',
      'Give your child several seconds to locate the speaker before repeating their name or prompt.'
    ],
    thingsToRemember: [
      'Children may show auditory attention by turning their head, looking toward the speaker, or pausing their current activity.',
      'Allow your child enough time to process and locate each voice.',
      'Keep the activity relaxed and avoid overwhelming your child with multiple voices at once.'
    ],
    relatedAssessment: 'Frequently Gives Direction to Other Voices',
    imagePath: act04Img
  },
  {
    id: 'act-05',
    title: 'Appears to Listen to Speaker',
    category: 'Auditory Attention',
    difficulty: 'Beginner',
    duration: '5 mins',
    description: 'Encourage your child to notice and attend to your voice by turning toward you when you speak or call their name.',
    goal: 'Increase the child’s ability to orient toward and attend to a speaker in response to their voice.',
    instructions: [
      'Sit near your child in a quiet environment where distractions are minimal.',
      'Call your child’s name or use a simple phrase such as "Look at me!" in a warm, clear voice.',
      'Pause and give your child a few seconds to turn toward you or show that they are listening.',
      'If they do not respond, gently repeat their name or move slightly into their line of sight.',
      'Praise and encourage them immediately when they orient toward you or attend to your voice.'
    ],
    parentTips: [
      'Begin in a quiet environment and gradually practice when there are more background sounds.',
      'Use an enthusiastic but natural tone of voice to make listening more engaging.',
      'Keep your phrases short and give your child enough time to respond before repeating.'
    ],
    thingsToRemember: [
      'Make sure your child can hear you clearly and that the environment is not overly distracting.',
      'A response can include turning their head, looking toward you, pausing an activity, or otherwise showing attention to your voice.',
      'Consistent responses to a speaker’s voice are an important foundation for auditory attention and receptive communication.'
    ],
    relatedAssessment: 'Appears to Listen to Speaker',
    imagePath: act05Img
  },
  {
    id: 'act-06',
    title: 'Often Looks at Speaker and Responds by Smiling',
    category: 'Social Communication',
    difficulty: 'Intermediate',
    duration: '5-10 mins',
    description: 'Encourage your child to look toward a familiar speaker and respond naturally with a smile during warm, engaging interactions.',
    goal: 'Increase the child’s ability to look toward a speaker and respond with a smile during social interaction.',
    instructions: [
      'Sit facing your child in a comfortable, distraction-free setting.',
      'Use their name or a cheerful phrase to get their attention.',
      'Smile warmly and use an engaging facial expression while speaking to them.',
      'Pause and give your child time to look toward you and respond with a smile or other positive expression.',
      'Respond warmly by smiling, praising, or continuing the interaction when they look toward you and smile.'
    ],
    parentTips: [
      'Use familiar games, songs, or playful sounds that naturally encourage social interaction.',
      'Give your child enough time to respond instead of immediately repeating your prompt.',
      'Keep interactions enjoyable and follow your child’s interest whenever possible.'
    ],
    thingsToRemember: [
      'A social response may include looking toward you, smiling, vocalizing, or showing another positive response.',
      'Focus on natural interaction rather than requiring a specific response every time.',
      'Praise and reinforce moments when your child looks toward you and responds socially.'
    ],
    relatedAssessment: 'Often Looks at Speaker and Responds by Smiling',
    imagePath: act06Img
  },
  {
    id: 'act-07',
    title: 'Response to Playful Activities',
    category: 'Social Interaction',
    difficulty: 'Beginner',
    duration: '5-10 mins',
    description: 'Encourage your child to engage with you during simple, enjoyable play activities and respond to your playful actions.',
    goal: 'Increase the child’s ability to participate in shared play by noticing, responding to, and continuing playful interactions with a parent.',
    instructions: [
      'Sit with your child in a comfortable space and choose a simple activity they enjoy.',
      'Start a playful action such as rolling a ball, stacking blocks, making funny sounds, or playing peekaboo.',
      'Pause briefly and wait to see how your child responds to the activity.',
      'Follow their response by continuing the game or imitating their actions.',
      'Celebrate their participation with smiles, encouraging words, and continued playful interaction.'
    ],
    parentTips: [
      'Choose activities that are familiar, enjoyable, and easy for your child to participate in.',
      'Pause frequently to give your child opportunities to initiate or respond.',
      'Follow your child’s interests rather than directing every part of the play.'
    ],
    thingsToRemember: [
      'Social interaction can include looking, smiling, vocalizing, moving toward you, imitating an action, or taking a turn.',
      'Keep the activity relaxed and enjoyable rather than expecting a specific response every time.',
      'Short, repeated play sessions can help build comfort and participation in shared activities.'
    ],
    relatedAssessment: 'Response to Playful Activities',
    imagePath: act07Img
  },
  {
    id: 'act-08',
    title: 'Responds to Speech by Looking Directly at the Speaker',
    category: 'Auditory Attention',
    difficulty: 'Advanced',
    duration: '5-10 mins',
    description: 'Encourage your child to orient toward the speaker and look at them when spoken to during natural, engaging interactions.',
    goal: 'Increase the child’s ability to look toward the speaker in response to spoken communication.',
    instructions: [
      'Sit facing your child in a quiet environment with minimal distractions.',
      'Call your child’s name or use a simple phrase such as "Can you look at me?" in a clear, natural voice.',
      'Pause and give your child several seconds to respond by looking toward you.',
      'If they do not respond, gently repeat their name or use an interesting sound to regain their attention.',
      'When your child looks toward you, respond positively and continue the conversation or activity.'
    ],
    parentTips: [
      'Use natural speech and familiar phrases rather than repeating the same prompt too frequently.',
      'Reduce background noise and distractions when first practicing this skill.',
      'Gradually practice during everyday activities and conversations in different settings.'
    ],
    thingsToRemember: [
      'A response may be brief; the goal is to orient toward the speaker when spoken to.',
      'Give your child enough processing time before providing another prompt.',
      'Encourage natural social attention without requiring prolonged or continuous eye contact.'
    ],
    relatedAssessment: 'Responds to Speech by Looking Directly at the Speaker',
    imagePath: act08Img
  },
  {
    id: 'act-09',
    title: 'Frequently Watches Lips and Mouth of Speaker',
    category: 'Visual Attention',
    difficulty: 'Beginner',
    duration: '5 mins',
    description: 'Encourage your child to notice and visually attend to your lips and mouth during simple, engaging face-to-face interactions.',
    goal: 'Increase the child’s ability to visually attend to the speaker’s mouth during speech and social interaction.',
    instructions: [
      'Sit facing your child in a quiet, comfortable setting.',
      'Get your child’s attention and speak using short, clear phrases while keeping your face visible.',
      'Slowly exaggerate natural mouth movements while saying simple sounds or familiar words.',
      'Pause between words and give your child time to look toward your mouth.',
      'Smile and praise your child when they visually attend to your mouth during the interaction.'
    ],
    parentTips: [
      'Choose familiar words, sounds, or songs that naturally capture your child’s interest.',
      'Make sure your face is well lit and clearly visible without forcing your child to look.',
      'Keep practice brief and playful so visual attention remains comfortable and engaging.'
    ],
    thingsToRemember: [
      'Visual attention to the mouth can be one way a child gathers information during spoken communication.',
      'Do not require continuous eye contact or prolonged staring at the mouth.',
      'Follow your child’s natural attention and reinforce brief moments of visual engagement.'
    ],
    relatedAssessment: 'Frequently Watches Lips and Mouth of Speaker',
    imagePath: act09Img
  },
  {
    id: 'act-10',
    title: 'Frequent Crying',
    category: 'Emotional Expression',
    difficulty: 'Intermediate',
    duration: '5-10 mins',
    description: 'Help your child recognize, communicate, and respond to emotions in a calm and supportive way during everyday situations.',
    goal: 'Increase the child’s ability to communicate emotional needs and use simple strategies to express feelings appropriately.',
    instructions: [
      'Choose a calm time when your child is comfortable and introduce simple emotion words such as "happy," "sad," "angry," or "upset."',
      'Use pictures, toys, or simple pretend-play situations to demonstrate different emotions.',
      'When your child becomes upset, calmly acknowledge their feeling using simple words such as "You are sad" or "You are upset."',
      'Model an appropriate way to communicate a need, such as pointing, using a gesture, or saying "help" or "more."',
      'Praise and comfort your child when they communicate their feelings or needs in any appropriate way.'
    ],
    parentTips: [
      'Stay calm and use a gentle, reassuring voice when your child is crying.',
      'Look for possible needs such as hunger, tiredness, discomfort, frustration, or difficulty communicating.',
      'Teach emotion words and communication strategies during calm moments rather than only when your child is upset.'
    ],
    thingsToRemember: [
      'Crying is a normal form of communication, especially when a child cannot yet express a need clearly.',
      'Focus on understanding and responding to the reason for the crying rather than simply stopping the crying.',
      'If crying is unusually frequent, intense, sudden, or accompanied by signs of illness or significant distress, consider discussing it with a pediatrician or qualified professional.'
    ],
    relatedAssessment: 'Frequent Crying',
    imagePath: act10Img
  },
  {
    id: 'act-11',
    title: 'Regularly Localizes Speaker with Eyes',
    category: 'Auditory Attention',
    difficulty: 'Beginner',
    duration: '5-10 mins',
    description: 'Encourage your child to locate the person speaking by turning their eyes or head toward the source of the voice.',
    goal: 'Increase the child’s ability to visually locate and orient toward a speaker when they hear their voice.',
    instructions: [
      'Sit near your child in a quiet environment while remaining outside their direct line of sight.',
      'Call your child’s name or make a gentle, familiar sound from one side.',
      'Pause and give your child a few seconds to locate the source of the sound.',
      'If needed, repeat the sound from a slightly different position or move into their visual field.',
      'Praise your child when they turn their eyes or head toward you and continue the interaction.'
    ],
    parentTips: [
      'Begin with the speaker positioned close to your child and gradually increase the distance.',
      'Use a calm, familiar voice and minimize competing background sounds.',
      'Practice from different positions, such as the side, slightly behind, or across the room.'
    ],
    thingsToRemember: [
      'The child may respond by moving their eyes, turning their head, or orienting their body toward the speaker.',
      'Give enough time for the child to process the sound before repeating the prompt.',
      'Keep the activity playful and avoid requiring prolonged eye contact.'
    ],
    relatedAssessment: 'Regularly Localizes Speaker with Eyes',
    imagePath: act11Img
  },
  {
    id: 'act-12',
    title: 'Frequent Crying',
    category: 'Emotional Expression',
    difficulty: 'Intermediate',
    duration: '5 mins',
    description: 'Help your child identify and communicate feelings and needs using simple words, gestures, or other comfortable forms of communication.',
    goal: 'Increase the child’s ability to communicate emotional needs and reduce frustration by using simple, appropriate communication strategies.',
    instructions: [
      'Choose a calm moment and introduce simple feeling words such as "happy," "sad," "angry," and "upset."',
      'Use pictures, toys, or pretend-play situations to show different emotions.',
      'Ask simple questions such as "Are you sad?" or "Do you need help?" and allow your child time to respond.',
      'Model an appropriate way to communicate a need, such as pointing, using a gesture, or saying "help," "more," or "finished."',
      'Acknowledge and praise your child when they communicate a feeling or need instead of relying only on crying.'
    ],
    parentTips: [
      'Practice emotion words and communication strategies when your child is calm.',
      'Pay attention to patterns that may lead to crying, such as tiredness, frustration, or difficulty communicating.',
      'Accept gestures, facial expressions, sounds, or words as forms of communication.'
    ],
    thingsToRemember: [
      'Crying can communicate many different needs and emotions, so first try to understand what your child is communicating.',
      'Avoid pressuring your child to name an emotion while they are highly upset.',
      'If frequent crying is persistent, unusually intense, or seems related to pain or illness, discuss your concerns with a pediatrician or qualified professional.'
    ],
    relatedAssessment: 'Frequent Crying',
    imagePath: act12Img
  },
  {
    id: 'act-13',
    title: 'Random Vocalization Rather than Crying',
    category: 'Vocal Communication',
    difficulty: 'Beginner',
    duration: '5-10 mins',
    description: 'Encourage your child to use spontaneous sounds and vocalizations during enjoyable interactions instead of relying primarily on crying to communicate.',
    goal: 'Increase purposeful vocalizations during play, social interaction, and everyday communication opportunities.',
    instructions: [
      'Choose a fun activity or toy that naturally interests your child.',
      'Join the activity and make simple, playful sounds or vocalizations that your child can easily imitate.',
      'Pause during the activity and give your child time to make a sound or vocalize.',
      'Respond positively to any purposeful vocalization by continuing the activity or acknowledging their communication.',
      'Gradually encourage vocalizations to accompany simple requests, greetings, or turn-taking.'
    ],
    parentTips: [
      'Use sounds, syllables, or simple words that match your child’s current communication level.',
      'Treat approximations and attempts as meaningful communication rather than expecting perfect pronunciation.',
      'Use motivating activities and natural pauses to create opportunities for your child to vocalize.'
    ],
    thingsToRemember: [
      'Vocal development varies from child to child, so focus on progress rather than comparing responses.',
      'Do not pressure your child to vocalize when they are frustrated or overwhelmed.',
      'If your child consistently relies on crying and rarely uses other forms of communication, consider discussing your concerns with a pediatrician or speech-language professional.'
    ],
    relatedAssessment: 'Random Vocalization Rather than Crying',
    imagePath: act13Img
  },
  {
    id: 'act-14',
    title: 'Vowel-Like Sounds Predominate',
    category: 'Vocal Communication',
    difficulty: 'Intermediate',
    duration: '5-10 mins',
    description: 'Encourage your child to experiment with a wider variety of speech sounds by modeling simple consonant-vowel combinations during playful interactions.',
    goal: 'Increase the variety and frequency of consonant-vowel vocalizations during play and everyday communication.',
    instructions: [
      'Choose a favorite toy or activity that naturally captures your child’s attention.',
      'Model simple sounds such as "ba," "ma," "pa," "da," or "go" while showing the related object or action.',
      'Pause after modeling the sound and give your child time to attempt a similar vocalization.',
      'Respond enthusiastically to any attempt and repeat the sound naturally during the activity.',
      'Gradually introduce different consonant-vowel combinations as your child becomes comfortable with the activity.'
    ],
    parentTips: [
      'Choose sounds that are easy to see and hear, and exaggerate your mouth movements naturally.',
      'Use motivating activities such as bubbles, cars, blocks, or songs to create frequent opportunities for vocal play.',
      'Accept approximations and partial attempts rather than expecting perfectly formed sounds.'
    ],
    thingsToRemember: [
      'Vowel-like vocalizations are an important part of early vocal development.',
      'Focus on increasing sound variety rather than correcting every vocalization.',
      'Keep practice playful and pressure-free, allowing your child to participate at their own pace.'
    ],
    relatedAssessment: 'Vowel-Like Sounds Predominate',
    imagePath: act14Img
  },
  {
    id: 'act-15',
    title: 'Has a Special Cry for Hunger',
    category: 'Vocal Communication',
    difficulty: 'Beginner',
    duration: '5 mins',
    description: 'Help your child recognize and communicate hunger using consistent sounds, gestures, or simple words during mealtime routines.',
    goal: 'Increase the child’s ability to use a consistent vocalization or other communication signal to indicate hunger or request food.',
    instructions: [
      'Observe and identify the sounds, gestures, or behaviors your child commonly uses when they are hungry.',
      'During mealtime, name the feeling or need using a simple phrase such as "You are hungry" or "Want food?"',
      'Pause briefly to give your child an opportunity to use their usual sound, gesture, or word to communicate.',
      'Respond promptly when your child communicates hunger and acknowledge their attempt with simple language.',
      'Over time, model a consistent word or sound such as "eat," "food," or "hungry" alongside their existing communication.'
    ],
    parentTips: [
      'Learn your child’s individual hunger cues and respond consistently.',
      'Pair simple words with natural routines so your child can connect the sound or word with its meaning.',
      'Accept vocalizations, gestures, pointing, or words as valid attempts to communicate hunger.'
    ],
    thingsToRemember: [
      'A child may communicate hunger through different sounds or behaviors, and these can change over time.',
      'Avoid intentionally delaying food when your child clearly needs to eat just to encourage communication.',
      'The goal is to build functional communication around a natural daily routine, not to require a specific sound.'
    ],
    relatedAssessment: 'Has a Special Cry for Hunger',
    imagePath: act15Img
  },
  {
    id: 'act-16',
    title: 'Develops Vocal Signs at Pleasure',
    category: 'Vocal Communication',
    difficulty: 'Intermediate',
    duration: '5-10 mins',
    description: 'Encourage your child to use pleasant vocalizations to express enjoyment, excitement, or interest during engaging social activities.',
    goal: 'Increase spontaneous vocalizations that communicate pleasure or positive engagement during enjoyable interactions.',
    instructions: [
      'Choose a favorite activity, toy, song, or social game that your child enjoys.',
      'Join your child and model simple happy sounds or expressions such as "ah," "wow," or "yay" during enjoyable moments.',
      'Pause during the activity and give your child an opportunity to make their own pleasant vocalization.',
      'Respond warmly to any vocal sign of enjoyment by smiling, acknowledging the sound, or continuing the activity.',
      'Repeat the activity regularly so your child has natural opportunities to associate vocalizations with positive experiences.'
    ],
    parentTips: [
      'Follow your child’s interests and use activities that naturally produce excitement or enjoyment.',
      'Accept a wide range of sounds, including squeals, laughs, babbling, and other positive vocalizations.',
      'Model sounds naturally without requiring your child to copy them exactly.'
    ],
    thingsToRemember: [
      'Vocal expressions of pleasure can vary widely from child to child.',
      'Focus on spontaneous communication and shared enjoyment rather than perfect sound production.',
      'Keep interactions playful, positive, and free from pressure.'
    ],
    relatedAssessment: 'Develops Vocal Signs at Pleasure',
    imagePath: act16Img
  },
  {
    id: 'act-17',
    title: 'Occasionally Responds to Sound Stimulation',
    category: 'Auditory Response',
    difficulty: 'Advanced',
    duration: '5-10 mins',
    description: 'Encourage your child to notice, orient toward, and respond to different safe everyday sounds through playful listening activities.',
    goal: 'Increase the child’s consistency in noticing and responding to auditory stimuli in their environment.',
    instructions: [
      'Choose a quiet setting and make a familiar, gentle sound such as a bell, clap, or shake of a toy.',
      'Pause and give your child several seconds to notice and respond to the sound.',
      'Observe whether they turn their head, look toward the sound, pause their activity, or make a vocal response.',
      'Repeat the activity from different directions while keeping the sound comfortable and easy to hear.',
      'Praise and acknowledge your child whenever they show a response to the sound.'
    ],
    parentTips: [
      'Start with familiar sounds that are gentle and not startling.',
      'Allow enough processing time before presenting another sound.',
      'Gradually introduce different everyday sounds as your child becomes comfortable.'
    ],
    thingsToRemember: [
      'Responses to sounds can include turning, looking, pausing, smiling, vocalizing, or moving toward the sound.',
      'Avoid loud or sudden sounds that could frighten or overwhelm your child.',
      'If your child consistently does not respond to sounds or their response to sound decreases, discuss this with a pediatrician or hearing professional.'
    ],
    relatedAssessment: 'Occasionally Responds to Sound Stimulation',
    imagePath: act17Img
  },
  {
    id: 'act-18',
    title: 'Vowel Like Sounds Predominate',
    category: 'Vocal Communication',
    difficulty: 'Beginner',
    duration: '5 mins',
    description: 'Encourage your child to expand their vocal play by exploring simple consonant-vowel combinations during enjoyable everyday interactions.',
    goal: 'Increase the variety of vocal sounds by encouraging the child to produce simple consonant-vowel combinations during play and communication.',
    instructions: [
      'Choose a favorite toy, activity, or song that naturally interests your child.',
      'Model simple sounds such as "ba," "ma," "pa," "da," or "go" while engaging with the activity.',
      'Pause after each sound and give your child several seconds to attempt a vocal response.',
      'Respond positively to any attempt, even if the sound is not an exact match.',
      'Gradually introduce new consonant-vowel combinations as your child becomes comfortable producing different sounds.'
    ],
    parentTips: [
      'Use sounds that are simple and easy for your child to observe and imitate.',
      'Pair vocal sounds with interesting actions, toys, or songs to make practice meaningful.',
      'Keep the activity playful and avoid repeatedly correcting your child’s pronunciation.'
    ],
    thingsToRemember: [
      'Vowel-like sounds are a normal part of early vocal development.',
      'Focus on increasing sound variety and purposeful vocal play rather than perfect pronunciation.',
      'Give your child enough time to respond and accept approximations as communication attempts.'
    ],
    relatedAssessment: 'Vowel Like Sounds Predominate',
    imagePath: act18Img
  },
  {
    id: 'act-19',
    title: 'Expresses Pleasure Vocally',
    category: 'Vocal Communication',
    difficulty: 'Intermediate',
    duration: '5-10 mins',
    description: 'Encourage your child to use vocalizations to express enjoyment, excitement, or satisfaction during fun and motivating activities.',
    goal: 'Increase spontaneous vocal expressions of pleasure during play and positive social interactions.',
    instructions: [
      'Choose a favorite toy, game, song, or activity that your child enjoys.',
      'Join your child and model simple vocal expressions such as "yay," "wow," "ah," or happy sounds when something enjoyable happens.',
      'Pause during the activity and give your child an opportunity to make their own vocal expression.',
      'Respond warmly to their vocalization by smiling, acknowledging it, or continuing the enjoyable activity.',
      'Repeat the activity and allow your child multiple opportunities to express enjoyment through sounds, laughter, or simple words.'
    ],
    parentTips: [
      'Choose activities that naturally make your child excited or happy.',
      'Accept laughter, squeals, babbling, sounds, and words as possible vocal expressions of pleasure.',
      'Model vocal expressions naturally without requiring your child to copy them exactly.'
    ],
    thingsToRemember: [
      'Children may express pleasure through different types of vocalizations.',
      'Focus on spontaneous and meaningful vocal communication rather than perfect words or sounds.',
      'Keep the interaction playful, positive, and pressure-free.'
    ],
    relatedAssessment: 'Expresses Pleasure Vocally',
    imagePath: act19Img
  }
];