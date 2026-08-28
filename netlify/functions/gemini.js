const { GoogleGenAI } = require('@google/genai');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GEMINI_API_KEY environment variable is not configured on Netlify server.' }),
    };
  }

  try {
    const { patient, assessment } = JSON.parse(event.body || '{}');

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are an expert AI Speech-Language Pathologist (SLP) assisting NIEPMD.
Analyze Module 1 assessment responses for patient: ${patient?.fullName || 'Patient'}.
Mandatory Rule: Output must state "AI-Assisted Draft — Requires Clinician Review" and make no medical diagnosis or claims of autism/speech delay.

Return valid JSON with fields: disclaimer, clinicalSummary, caregiverSummary, homeStrategies, strengths, areasForImprovement, recommendations.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.disclaimer = 'AI-Assisted Draft — Requires Clinician Review';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, data: parsed }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message,
        fallback: {
          disclaimer: 'AI-Assisted Draft — Requires Clinician Review',
          clinicalSummary: 'Module 1 evaluation completed under clinician supervision.',
          caregiverSummary: 'Positive auditory and social responsiveness cooing behaviors observed.',
          homeStrategies: ['Practice gentle sound games face-to-face.'],
          strengths: ['Responds to familiar voice.'],
          areasForImprovement: ['Practice sound orientation.'],
          recommendations: ['Follow up with treating therapist.'],
        },
      }),
    };
  }
};
