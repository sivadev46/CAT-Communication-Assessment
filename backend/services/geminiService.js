import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';

/**
 * Service to interface with Google Gemini AI API
 */
export const geminiService = {
  /**
   * Generates a structured clinical and caregiver report from assessment details
   * @param {Object} patient - Patient record details
   * @param {Object} assessment - Completed assessment scores
   * @param {Object} notes - Clinician notes mapped by item IDs
   * @returns {Promise<Object>} Structured report data matching schema
   */
  generateAIReportFromAssessment: async (patient, assessment, notes) => {
    const apiKey = env.geminiApiKey;

    if (!apiKey) {
      throw new Error(
        'Gemini API key is missing. Please configure GEMINI_API_KEY in your environment variables or backend .env file.'
      );
    }

    // Initialize the Google GenAI client
    const ai = new GoogleGenAI({ apiKey });

    // Compile assessment category details
    const scoresSummary = `
- Overall Score: ${assessment.overallPercentage || 0}%
- Domain Performance breakdown:
  * Eye Contact: ${assessment.eyeContact || 0}%
  * Joint Attention: ${assessment.jointAttention || 0}%
  * Receptive Language: ${assessment.receptiveLanguage || 0}%
  * Expressive Language: ${assessment.expressiveLanguage || 0}%
  * Social Interaction: ${assessment.socialInteraction || 0}%
    `.trim();

    // Compile clinician observations
    const observations = Object.entries(notes || {})
      .filter(([_, val]) => val && val.trim() !== '')
      .map(([itemId, text]) => `- Item ${itemId}: "${text.trim()}"`)
      .join('\n') || 'No specific item observations logged.';

    // Compile detailed behavior responses
    let responsesDetails = '';
    if (assessment.responses) {
      try {
        const parsedResponses = JSON.parse(assessment.responses);
        responsesDetails = Object.entries(parsedResponses)
          .map(([itemId, val]) => {
            const stateLabel = val === 'present' ? 'Fully Present (Established)' : 
                               val === 'partially-present' ? 'Partially Present (Emerging / Inconsistent performance)' : 
                               'Absent (Not observed)';
            const noteText = notes[itemId] ? ` (Clinician Note: "${notes[itemId]}")` : '';
            return `- Behavior/Skill [${itemId}]: ${stateLabel}${noteText}`;
          })
          .join('\n');
      } catch {
        responsesDetails = 'Detailed behavior states could not be parsed.';
      }
    } else {
      responsesDetails = 'No detailed behavior states provided.';
    }

    // Construct Prompts (Separate prompts definition as requested)
    const prompt = `
You are an expert AI clinical Speech-Language Pathologist (SLP) assisting with diagnostic analysis.
Analyze the following patient profile, assessment scores, detailed behavior states, and clinician observations.

The assessment utilizes a three-state evaluation system:
- **Fully Present**: The behavior/milestone is established and consistently observed (1.0 points).
- **Partially Present**: The behavior/milestone is emerging, developing, or inconsistent, showing progress with guidance but requiring moderate support (0.5 points).
- **Absent**: The behavior/milestone is not observed or is absent (0.0 points).

=== PATIENT DETAILS ===
Name: ${patient.fullName}
Age: ${patient.age} years
Gender: ${patient.gender}
Admitting/Clinical Diagnosis: ${patient.diagnosis || 'Evaluation pending'}
Guardian Name: ${patient.guardianName || 'N/A'}
Clinician General Notes: ${patient.notes || 'N/A'}

=== ASSESSMENT METRICS ===
${scoresSummary}

=== DETAILED BEHAVIORAL STATES ===
${responsesDetails}

=== CLINICAL OBSERVATIONS & NOTES ===
${observations}

=== INSTRUCTIONS ===
Perform a deep clinical analysis of the data. Avoid binary (present/absent) clinical descriptions.
Treat "Partially Present" skills as emerging skills, developing abilities, or inconsistent performances that show progress but require guidance or moderate support.

You must generate:
1. A **Clinical Executive Summary** (saved inside clinicalSummary) which:
   - Must be unique for this patient based on details, scores, notes, and results.
   - Must sound like a professional speech-language pathologist's clinical report.
   - Must consist of exactly 2 to 4 concise, professional paragraphs.
   - Must explicitly discuss emerging (Partially Present) abilities as developing/inconsistent, specifying where progress is visible with guidance.
   - Paragraph 1 should outline the evaluation context, patient background, and overall score metrics.
   - Paragraph 2 should detail specific behavioral observations and performance across domains from clinician notes and behavior states.
   - Paragraph 3/4 should interpret these findings clinically, classifying developmental risk and stating clinical expectations.
   - Must NOT contain the text "System Generated Fallback" or "Clinical assessment completed...".
2. A **Caregiver Report** (Summary and Home Strategies) (saved inside caregiverSummary and homeStrategies) using simple, warm, parent-friendly language. Avoid all medical jargon. Reflect emerging skills as areas of progress to be encouraged, and home strategies should include activities to practice these developing skills.
3. A list of 2-4 **Key Clinical Strengths** (include established present skills and notable emerging skills).
4. A list of 2-4 **Focus Areas for Improvement** (focus on absent skills and emerging skills that need moderate support).
5. A list of 2-4 **Clinical Recommendations** (specific therapy plan recommendations).

Return the response strictly adhering to the JSON schema requested.
`.trim();

    // Define strict JSON schema matching database fields
    const responseSchema = {
      type: 'OBJECT',
      properties: {
        clinicalSummary: {
          type: 'STRING',
          description: 'A detailed professional summary of the assessment findings in medical terms. Must consist of exactly 2 to 4 concise paragraphs.'
        },
        riskLevel: {
          type: 'STRING',
          enum: ['Low', 'Medium', 'High'],
          description: 'The overall developmental communication risk level classification.'
        },
        followUpRecommendation: {
          type: 'STRING',
          description: 'Suggested timeframe and style of follow-up evaluations.'
        },
        caregiverSummary: {
          type: 'STRING',
          description: 'A warm, parent-friendly summary of findings without medical jargon.'
        },
        homeStrategies: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: 'List of simple actionable speech exercises parents can practice with the child at home.'
        },
        strengths: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: 'Key skills where the patient performs well.'
        },
        areasForImprovement: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: 'Target behaviors needing immediate focus.'
        },
        recommendations: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: 'Specific clinical therapy recommendations.'
        }
      },
      required: [
        'clinicalSummary',
        'riskLevel',
        'followUpRecommendation',
        'caregiverSummary',
        'homeStrategies',
        'strengths',
        'areasForImprovement',
        'recommendations'
      ]
    };

    try {
      console.log(`[Gemini Request Payload Info]:`);
      console.log(`- Model Used: gemini-flash-latest`);
      console.log(`- Prompt Length: ${prompt.length} characters`);
      console.log(`- Prompt Sent:\n${prompt}`);
      console.log(`- Response Schema:\n${JSON.stringify(responseSchema, null, 2)}`);

      // Call Gemini Flash Latest for fast, accurate structured JSON output
      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          systemInstruction: 'You are a professional Speech Language Pathologist assistant. Always provide accurate, structured responses as valid JSON matching the specified schema.'
        }
      });

      const responseText = response.text;
      console.log(`- Raw Gemini Response:\n${responseText}`);

      if (!responseText) {
        throw new Error('Empty response received from Gemini AI model.');
      }

      // Safely parse JSON structure
      const parsedData = JSON.parse(responseText.trim());
      console.log(`- Parsed JSON:\n${JSON.stringify(parsedData, null, 2)}`);
      return parsedData;

    } catch (error) {
      console.error('[Gemini AI Exception Raised]:');
      console.error('- Full error stack:', error.stack || error);
      console.error('- Complete error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      if (error.status) console.error(`- API Status Code: ${error.status}`);
      if (error.message) console.error(`- API Message: ${error.message}`);
      
      // Categorize and throw user-friendly error messages
      if (error.name === 'SyntaxError') {
        throw new Error('Failed to parse AI response. Gemini returned an invalid JSON structure.');
      }
      
      if (error.status === 403 || error.message?.includes('API key')) {
        throw new Error('Google Gemini authentication failed. Please verify that your API key is correct and active.');
      }
      
      if (error.status === 404) {
        throw new Error('Google Gemini model endpoint not found (404). Please ensure the model is available.');
      }

      if (error.status === 429) {
        throw new Error('Google Gemini rate limit/quota exceeded (429). Please check billing/quota details.');
      }
      
      if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
        throw new Error('AI report generation timed out. Please check your network connection and try again.');
      }

      throw new Error(`AI generation failed: ${error.message || error}`);
    }
  }
};
