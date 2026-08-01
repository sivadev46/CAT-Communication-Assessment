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

    // Construct Prompts (Separate prompts definition as requested)
    const prompt = `
You are an expert AI clinical Speech-Language Pathologist (SLP) assisting with diagnostic analysis.
Analyze the following patient profile, assessment scores, and clinician observations:

=== PATIENT DETAILS ===
Name: ${patient.fullName}
Age: ${patient.age} years
Gender: ${patient.gender}
Admitting/Clinical Diagnosis: ${patient.diagnosis || 'Evaluation pending'}
Guardian Name: ${patient.guardianName || 'N/A'}
Clinician General Notes: ${patient.notes || 'N/A'}

=== ASSESSMENT METRICS ===
${scoresSummary}

=== CLINICAL OBSERVATIONS ===
${observations}

=== INSTRUCTIONS ===
Perform a deep clinical analysis of the data. You must generate:
1. A **Clinical Report** (Executive summary, Risk Level, and Follow-up Recommendations) using professional clinical terminology suitable for other healthcare professionals.
2. A **Caregiver Report** (Summary and Home Strategies) using simple, warm, parent-friendly language. Avoid all medical jargon and terms (e.g. use "understands what we say" instead of "receptive language", "talking and expressing" instead of "expressive syntax", etc.).
3. A list of 2-4 **Key Clinical Strengths**.
4. A list of 2-4 **Focus Areas for Improvement**.
5. A list of 2-4 **Clinical Recommendations** (specific therapy plan recommendations).

Return the response strictly adhering to the JSON schema requested.
`.trim();

    // Define strict JSON schema matching database fields
    const responseSchema = {
      type: 'OBJECT',
      properties: {
        clinicalSummary: {
          type: 'STRING',
          description: 'A detailed professional summary of the assessment findings in medical terms.'
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
      // Call Gemini 2.5 Flash for fast, accurate structured JSON output
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          systemInstruction: 'You are a professional Speech Language Pathologist assistant. Always provide accurate, structured responses as valid JSON matching the specified schema.'
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response received from Gemini AI model.');
      }

      // Safely parse JSON structure
      const parsedData = JSON.parse(responseText.trim());
      return parsedData;

    } catch (error) {
      console.error('[Gemini AI Error]:', error);
      
      // Categorize and throw user-friendly error messages
      if (error.name === 'SyntaxError') {
        throw new Error('Failed to parse AI response. Gemini returned an invalid JSON structure.');
      }
      
      if (error.status === 403 || error.message.includes('API key')) {
        throw new Error('Google Gemini authentication failed. Please verify that your API key is correct and active.');
      }
      
      if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
        throw new Error('AI report generation timed out. Please check your network connection and try again.');
      }

      throw new Error(`AI generation failed: ${error.message}`);
    }
  }
};
