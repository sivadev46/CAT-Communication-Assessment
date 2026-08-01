import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Assessment from '../models/Assessment.js';
import Report from '../models/Report.js';

export const seedDatabase = async () => {
  try {
    // 1. Check and Seed Clinician User
    let clinician = await User.findOne({ email: 'clinician@cat.com' });

    if (!clinician) {
      console.log('[Seed] Default clinician user missing. Creating default user...');
      clinician = await User.create({
        fullName: 'Dr. Sarah Jenkins',
        email: 'clinician@cat.com',
        password: 'Password123!',
        role: 'Clinician',
        profileImage: '',
      });
      console.log(`[Seed] Successfully created default user: ${clinician.email} (${clinician.role})`);
    } else {
      console.log(`[Seed] Clinician user ${clinician.email} already exists.`);
    }

    // 2. Check and Seed Sample Patients
    const patientCount = await Patient.countDocuments();
    if (patientCount === 0) {
      console.log('[Seed] Seeding initial patient profiles...');
      const patients = await Patient.create([
        {
          fullName: 'Robert Langdon',
          age: '58',
          gender: 'Male',
          diagnosis: 'Expressive Aphasia',
          status: 'Scheduled',
          patientId: 'PT-89421',
          notes: 'Post-stroke expressive language rehabilitation protocol.',
          createdBy: clinician._id,
        },
        {
          fullName: 'Eleanor Vance',
          age: '42',
          gender: 'Female',
          diagnosis: 'Dysarthria Assessment',
          status: 'In Progress',
          patientId: 'PT-63104',
          notes: 'Motor speech evaluation and articulation accuracy measurement.',
          createdBy: clinician._id,
        },
        {
          fullName: 'Arthur Pendelton',
          age: '67',
          gender: 'Male',
          diagnosis: 'Cognitive Communication Deficit',
          status: 'Completed',
          patientId: 'PT-41290',
          notes: 'Memory retention and joint attention therapy tracking.',
          createdBy: clinician._id,
        },
      ]);
      console.log('[Seed] Initial patient profiles seeded successfully.');

      // 3. Seed Sample Assessment & Report
      const samplePatient = patients[0];
      const assessmentCount = await Assessment.countDocuments();
      if (assessmentCount === 0) {
        console.log('[Seed] Seeding sample assessment...');
        const assessment = await Assessment.create({
          patient: samplePatient._id,
          clinician: clinician._id,
          eyeContact: 85,
          jointAttention: 78,
          receptiveLanguage: 90,
          expressiveLanguage: 65,
          socialInteraction: 80,
          overallScore: 398,
          overallPercentage: 79.6,
          notes: 'Patient responded well to visual prompts; verbal output requires focused exercises.',
          status: 'Completed',
        });

        await Report.create({
          assessment: assessment._id,
          generatedBy: clinician._id,
          clinicalReport: {
            summary: 'Comprehensive Speech & Communication Profile',
            findings: 'High receptive language retention with mild expressive delay.',
          },
          caregiverReport: {
            summary: 'Home Communication Guidance',
            recommendations: 'Encourage daily 15-minute picture card naming routines.',
          },
          recommendations: ['Daily vocabulary exercises', 'Bimonthly articulation check'],
          strengths: ['Excellent eye contact', 'Strong visual comprehension'],
          areasForImprovement: ['Phonemic fluency', 'Sentence construction speed'],
        });
        console.log('[Seed] Sample assessment and report seeded successfully.');
      }
    }
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error.message);
  }
};
