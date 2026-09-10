-- ============================================================
-- NIEPMD Communication Assessment Tool (CAT)
-- Seed Data for Supabase
-- Module 1: Pre-Intentional Communication Tool (0-3 months, 21 Activities)
-- ============================================================

-- 1. SEED MODULES (Module 1 Unlocked, Modules 2-8 Locked)
INSERT INTO public.assessment_modules 
(id, module_number, name, subtitle, age_range, description, status, display_order)
VALUES 
(
  'm1000000-0000-0000-0000-000000000001',
  1,
  'Pre-Intentional Communication Tool',
  'Early Auditory & Social Response Behaviors',
  '0–3 months',
  'Evaluates foundational auditory responsiveness, social engagement, vocalization patterns, and reflex/orienting behaviors in infants aged 0 to 3 months.',
  'published',
  1
),
(
  'm2000000-0000-0000-0000-000000000002',
  2,
  'Intentional Communication Tool',
  'Gaze Shift, Pointing & Early Gestures',
  '3–6 months',
  'Evaluates emerging intentional communication, gaze shifting, reaching, and early vocal imitations.',
  'locked',
  2
),
(
  'm3000000-0000-0000-0000-000000000003',
  3,
  'Early Symbolic Communication',
  'Babbling & Functional Gestures',
  '6–9 months',
  'Evaluates canonical babbling, gesture comprehension, and shared attention during structured play.',
  'locked',
  3
),
(
  'm4000000-0000-0000-0000-000000000004',
  4,
  'First Words & Receptive Vocabulary',
  'Single Word Production & Receptive Naming',
  '9–12 months',
  'Evaluates first functional words, following single commands, and identifying familiar objects.',
  'locked',
  4
),
(
  'm5000000-0000-0000-0000-000000000005',
  5,
  'Early Word Combinations',
  '2-Word Phrases & Semantic Relations',
  '12–18 months',
  'Evaluates vocabulary expansion, 2-word phrase combinations, and expressive gestures.',
  'locked',
  5
),
(
  'm6000000-0000-0000-0000-000000000006',
  6,
  'Complex Sentence Structures',
  'Grammatical Development & Storytelling',
  '18–24 months',
  'Evaluates 3+ word sentences, grammatical morphemes, and early narrative skills.',
  'locked',
  6
),
(
  'm7000000-0000-0000-0000-000000000007',
  7,
  'Pragmatics & Peer Interaction',
  'Conversational Turn-taking & Social Play',
  '24–36 months',
  'Evaluates pragmatic turn-taking, topic maintenance, and social engagement with peers.',
  'locked',
  7
),
(
  'm8000000-0000-0000-0000-000000000008',
  8,
  'Advanced Speech & Language Mechanics',
  'Phonological Processing & Executive Function',
  '36+ months',
  'Evaluates advanced articulation, phonological processing, and complex problem solving.',
  'locked',
  8
)
ON CONFLICT (module_number) DO UPDATE SET 
  name = EXCLUDED.name,
  status = EXCLUDED.status;

-- 2. SEED MODULE 1 ACTIVITIES (21 NIEPMD ACTIVITIES)
INSERT INTO public.assessment_activities 
(module_id, activity_number, title, category, description, instruction, goal, parent_tips, things_to_remember, image_url, video_url, display_order)
VALUES
(
  'm1000000-0000-0000-0000-000000000001',
  1,
  'Startle response to loud sudden noises',
  'Auditory Response',
  'Observe and support your child’s response to sudden, unexpected sounds in a calm setting.',
  'Introduce a mild unexpected sound from a safe distance and observe your child’s startle or eye blink response.',
  'Build comfort and observe autonomic/motor auditory reflex response.',
  '["Start with gentle sounds and avoid scaring your child.", "Give enough time to settle down."]'::jsonb,
  '["Every child responds differently to sudden sounds.", "Praise calm recovery."]'::jsonb,
  '/src/assets/activities/Startle response to loud sudden noises.png',
  'https://youtu.be/tSqHEyWPZSI?si=ZUdE17SDP2aQ29qU',
  1
),
(
  'm1000000-0000-0000-0000-000000000001',
  2,
  'Activity arrested when approached by sound',
  'Auditory Response',
  'Observe whether your child pauses or stops an ongoing activity when they hear a sound approaching.',
  'While child is engaged in play, make a gentle sound nearby and watch if motor activity momentarily pauses.',
  'Increase child’s ability to notice and orient toward approaching sounds.',
  '["Begin with soft, familiar sounds.", "Give the child time to process."]'::jsonb,
  '["Children may pause, look, or turn when sound is detected."]'::jsonb,
  '/src/assets/activities/Activity arrested when approached by sound.png',
  'https://youtu.be/KxSc9aIK3CY?si=7WSQGeRuDLv283AH',
  2
),
(
  'm1000000-0000-0000-0000-000000000001',
  3,
  'Often Quieted by Familiar Friendly Voice',
  'Auditory Response',
  'Observe if the child calms or settles down when hearing a familiar, friendly caregiver voice.',
  'When child is mildly restless, speak softly using warm, short reassuring phrases.',
  'Promote vocal auditory soothing and emotional calming.',
  '["Use a warm and soothing voice tone.", "Maintain close proximity."]'::jsonb,
  '["Some infants show quietness by relaxing posture or stopping crying."]'::jsonb,
  '/src/assets/activities/Often Quieted by Familiar Friendly Voice.png',
  'https://youtu.be/85rH54jqJLM?si=Cjw-pucS-JGPSo0r',
  3
),
(
  'm1000000-0000-0000-0000-000000000001',
  4,
  'Frequently Gives Direction to Other Voices',
  'Auditory Attention',
  'Notice and orient toward different voices in the room, shifting attention toward the speaker.',
  'Have two familiar adults speak alternately from different directions and observe head/eye shifts.',
  'Improve auditory localization and voice discrimination.',
  '["Keep background noise low.", "Allow several seconds for localization."]'::jsonb,
  '["Observe head turn or eye shift direction."]'::jsonb,
  '/src/assets/activities/Frequently Gives Direction to Other Voices.png',
  'https://youtu.be/RCRhrbtq3z8?si=IeChTcDdbQ1arSgh',
  4
),
(
  'm1000000-0000-0000-0000-000000000001',
  5,
  'Appears to Listen to Speaker',
  'Auditory Attention',
  'Child demonstrates visual or motor stillness indicating focused listening when spoken to directly.',
  'Speak clearly facing child and observe sustained listening posture.',
  'Enhance focused auditory attention to spoken speech.',
  '["Use engaging vocal inflection.", "Keep visual distance around 12 inches."]'::jsonb,
  '["Listening attention precedes speech comprehension."]'::jsonb,
  '/src/assets/activities/Appears to Listen to Speaker.png',
  'https://youtu.be/Xh5UMNC-cL0?si=D6uPWGsLZdaDDGq7',
  5
),
(
  'm1000000-0000-0000-0000-000000000001',
  6,
  'Often Looks at Speaker and Responds by Smiling',
  'Social Communication',
  'Child looks toward familiar speaker and responds with a natural, social smile.',
  'Gaze directly at child with a warm smile and gentle words, waiting for social smiling response.',
  'Build reciprocal social smiling and gaze engagement.',
  '["Combine cheerful tone with clear facial expressions."]'::jsonb,
  '["Social smile usually emerges around 6-8 weeks of age."]'::jsonb,
  '/src/assets/activities/Often Looks at Speaker and Responds by Smiling.png',
  'https://youtu.be/1lCt40djJrI?si=fuM0OiWUBa2t1wcW',
  6
),
(
  'm1000000-0000-0000-0000-000000000001',
  7,
  'Response to Playful Activities',
  'Social Interaction',
  'Child shows pleasure or motor excitement during gentle tickles, peekaboo, or playful sounds.',
  'Engage in gentle face-to-face play (e.g. peekaboo or gentle vocal rhythm) and observe excitement.',
  'Foster positive affect during shared social interaction.',
  '["Follow child enthusiasm level.", "Keep playful games gentle."]'::jsonb,
  '["Look for smiles, vocal sounds, or arm wiggles."]'::jsonb,
  '/src/assets/activities/Response to Playful Activities.png',
  'https://youtu.be/1lCt40djJrI?si=fuM0OiWUBa2t1wcW',
  7
),
(
  'm1000000-0000-0000-0000-000000000001',
  8,
  'Responds to Speech by Looking Directly at the Speaker',
  'Auditory Attention',
  'Child turns head or shifts eyes to establish direct gaze at the person speaking.',
  'Call child’s name softly from the side and observe head turning to establish eye contact.',
  'Strengthen auditory-visual orientation to human speech.',
  '["Use short, clear name call.", "Pause between attempts."]'::jsonb,
  '["Direct eye contact builds communicative connection."]'::jsonb,
  '/src/assets/activities/Responds to Speech by Looking Directly at the Speaker.png',
  'https://youtu.be/TJWlQywfbQo?si=QvS5H-rDGNWLFXVb',
  8
),
(
  'm1000000-0000-0000-0000-000000000001',
  9,
  'Frequently Watches Lips and Mouth of Speaker',
  'Visual Attention',
  'Child fixes visual gaze on the speaker’s mouth during speech sounds.',
  'Position child comfortably face-to-face and pronounce distinct vowel sounds while highlighting mouth movement.',
  'Encourage visual speech reading and mouth orientation.',
  '["Exaggerate lip shapes naturally when speaking."]'::jsonb,
  '["Visual mouth tracking helps infants learn speech articulation patterns."]'::jsonb,
  '/src/assets/activities/Frequently Watches Lips and Mouth of Speaker.png',
  'https://youtu.be/TJWlQywfbQo?si=QvS5H-rDGNWLFXVb',
  9
),
(
  'm1000000-0000-0000-0000-000000000001',
  10,
  'Frequent Crying',
  'Emotional Expression',
  'Observe frequency and context of crying as a basic distress communication channel.',
  'Observe infant crying patterns, pitch changes, and responsiveness to comforting care.',
  'Assess crying as a primary early distress signal.',
  '["Note time of day and triggers.", "Respond consistently to build trust."]'::jsonb,
  '["Crying is the infant primary communication tool for hunger, discomfort, or fatigue."]'::jsonb,
  '/src/assets/activities/Frequent Crying.png',
  'https://youtu.be/mUUnO3X3Kgs?si=q8FySxgd8KMgfVhl',
  10
),
(
  'm1000000-0000-0000-0000-000000000001',
  11,
  'Regularly Localizes Speaker with Eyes',
  'Auditory Attention',
  'Child reliably moves eyes to locate speaker in horizontal visual plane.',
  'Move slowly across child field of vision while speaking softly and check if eyes follow speaker.',
  'Improve visual tracking coupled with voice orientation.',
  '["Move smoothly at eye level."]'::jsonb,
  '["Consistently locating speaker displays healthy auditory-visual integration."]'::jsonb,
  '/src/assets/activities/Regularly Localizes Speaker with Eyes.png',
  'https://youtu.be/RCRhrbtq3z8?si=IeChTcDdbQ1arSgh',
  11
),
(
  'm1000000-0000-0000-0000-000000000001',
  12,
  'Differentiates Crying Tones',
  'Emotional Expression',
  'Observe distinct variation in crying intensity and pitch depending on discomfort or fatigue.',
  'Observe crying variations during different needs (pain vs hunger vs tiredness).',
  'Identify differentiated vocal signals of discomfort.',
  '["Listen closely to changes in tone and rhythm."]'::jsonb,
  '["Differentiated crying indicates emerging communicative signaling."]'::jsonb,
  '/src/assets/activities/Frequent Crying2.png',
  'https://youtu.be/mUUnO3X3Kgs?si=q8FySxgd8KMgfVhl',
  12
),
(
  'm1000000-0000-0000-0000-000000000001',
  13,
  'Random Vocalization Rather than Crying',
  'Vocal Communication',
  'Infant produces non-crying vocal sounds (e.g. gurgles, coos, sighs) when relaxed.',
  'During calm state, listen for spontaneous non-crying vocalizations and imitate them back.',
  'Promote non-distress cooing and spontaneous vocal play.',
  '["Imitate infant sounds to encourage vocal turn-taking."]'::jsonb,
  '["Coos and soft vocal sounds mark the transition into pleasant vocal play."]'::jsonb,
  '/src/assets/activities/Random Vocalization Rather than Crying.png',
  'https://youtu.be/OKWWB51LcBk?si=1R2gowd5FM1BeaDU',
  13
),
(
  'm1000000-0000-0000-0000-000000000001',
  14,
  'Vowel-Like Sounds Predominate',
  'Vocal Communication',
  'Child produces open vowel-like vocalizations (e.g., /a/, /e/, /u/).',
  'Listen for open vowel coos and reflect them back cheerfully.',
  'Expand open vowel repertoire in vocal play.',
  '["Repeat the vowel sounds your baby makes."]'::jsonb,
  '["Vowel cooing is foundational for speech motor control."]'::jsonb,
  '/src/assets/activities/Vowel-Like Sounds Predominate.png',
  'https://youtu.be/OKWWB51LcBk?si=1R2gowd5FM1BeaDU',
  14
),
(
  'm1000000-0000-0000-0000-000000000001',
  15,
  'Has a Special Cry for Hunger',
  'Early Communication',
  'Child demonstrates a distinct rhythmic cry pattern specifically linked to hunger.',
  'Observe if hunger cry has a characteristic rhythmic pattern and prompt feeding.',
  'Identify specific functional hunger signals.',
  '["Notice if cry has a repetitive low-to-high pitch pattern."]'::jsonb,
  '["Hunger cry is one of the earliest intent-based physical signals."]'::jsonb,
  '/src/assets/activities/Has a Special Cry for Hunger.png',
  'https://youtu.be/OKWWB51LcBk?si=1R2gowd5FM1BeaDU',
  15
),
(
  'm1000000-0000-0000-0000-000000000001',
  16,
  'Develops Vocal Signs at Pleasure',
  'Vocal Communication',
  'Infant makes happy cooing sounds when comfortable, fed, or cuddled.',
  'Cuddle and talk to child when relaxed and observe joyful vocal signs.',
  'Encourage positive vocal expression of pleasure.',
  '["Smile and talk back when baby coos happily."]'::jsonb,
  '["Pleasure vocalizations build emotional bonding."]'::jsonb,
  '/src/assets/activities/Develops Vocal Signs at Pleasure.png',
  'https://youtu.be/1lCt40djJrI?si=fuM0OiWUBa2t1wcW',
  16
),
(
  'm1000000-0000-0000-0000-000000000001',
  17,
  'Occasionally Responds to Sound Stimulation',
  'Auditory Response',
  'Child shows occasional body movement or eye widening when sound stimuli are present.',
  'Play soft musical toy or rattle nearby and observe subtle motor responses.',
  'Track intermittent sensory awareness to auditory stimuli.',
  '["Use gentle toys that make soft sounds."]'::jsonb,
  '["Responses can include widening eyes, stilling, or arm movement."]'::jsonb,
  '/src/assets/activities/Occasionally Responds to Sound Stimulation.png',
  'https://youtu.be/KxSc9aIK3CY?si=7WSQGeRuDLv283AH',
  17
),
(
  'm1000000-0000-0000-0000-000000000001',
  18,
  'Vowel Sounds Progression',
  'Vocal Communication',
  'Sustained production of varied vowel sonorants during social interaction.',
  'Engage in vocal back-and-forth matching vowel sounds.',
  'Strengthen sustained vowel sound duration.',
  '["Maintain gentle eye contact while making vowel sounds."]'::jsonb,
  '["Vocal turn-taking lays the foundation for conversation."]'::jsonb,
  '/src/assets/activities/Vowel Like Sounds Predominate.png',
  'https://youtu.be/OKWWB51LcBk?si=1R2gowd5FM1BeaDU',
  18
),
(
  'm1000000-0000-0000-0000-000000000001',
  19,
  'Expresses Pleasure Vocally',
  'Vocal Communication',
  'Child vocalizes clear happy tones, laughs, or squeals of pleasure during play.',
  'Engage in warm tickle or smile game and listen for vocal expressions of delight.',
  'Promote vocal expression of positive affect.',
  '["Share laughter and happy facial expressions."]'::jsonb,
  '["Expressing pleasure vocally promotes social closeness."]'::jsonb,
  '/src/assets/activities/Expresses Pleasure Vocally.png',
  'https://youtu.be/1lCt40djJrI?si=fuM0OiWUBa2t1wcW',
  19
),
(
  'm1000000-0000-0000-0000-000000000001',
  20,
  'Sustained Visual Gaze on Caregiver Face',
  'Visual Attention',
  'Child holds visual focus on caregiver face for at least 3-5 seconds.',
  'Hold child comfortably at 10-12 inches distance and speak softly while maintaining visual presence.',
  'Increase duration of face-to-face visual engagement.',
  '["Keep face softly illuminated and avoid bright glares behind you."]'::jsonb,
  '["Face gazing builds early attachment and social recognition."]'::jsonb,
  '/src/assets/activities/Responds to Speech by Looking Directly at the Speaker.png',
  'https://youtu.be/TJWlQywfbQo?si=QvS5H-rDGNWLFXVb',
  20
),
(
  'm1000000-0000-0000-0000-000000000001',
  21,
  'Reciprocal Vocal Turn-Taking',
  'Social Communication',
  'Child waits and responds with vocal sound after adult speaks.',
  'Speak a soft coo, wait for child sound, then respond back in a conversational rhythm.',
  'Develop fundamental conversational turn-taking rhythm.',
  '["Always wait 3-5 seconds for your baby to respond before speaking again."]'::jsonb,
  '["Turn-taking is the core structure of human communication."]'::jsonb,
  '/src/assets/activities/Often Looks at Speaker and Responds by Smiling.png',
  'https://youtu.be/Xh5UMNC-cL0?si=D6uPWGsLZdaDDGq7',
  21
)
ON CONFLICT (module_id, activity_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  instruction = EXCLUDED.instruction,
  image_url = EXCLUDED.image_url,
  video_url = EXCLUDED.video_url;

-- 3. SEED SAMPLE PATIENT (For Parent Portal linking demo)
INSERT INTO public.patients
(id, patient_id_code, full_name, date_of_birth, gender)
VALUES
(
  'p1000000-0000-0000-0000-000000000124',
  'CAT-2026-00124',
  'Aarav Kumar',
  '2026-05-12',
  'Male'
)
ON CONFLICT (patient_id_code) DO NOTHING;

