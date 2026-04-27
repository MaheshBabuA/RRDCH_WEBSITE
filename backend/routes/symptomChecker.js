const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { symptoms, duration, language } = req.body;

  if (!symptoms) {
    return res.status(400).json({ success: false, message: 'Symptoms are required' });
  }

  const systemPrompt = `You are an expert Dental Triage Assistant for Rajarajeswari Dental College & Hospital (RRDCH). You will receive dental symptoms in various Indian languages. Your first task is to translate the input to English internally, then perform a clinical triage. Generate the final AI Report in both English and the patient's native language. Provide output in strictly valid JSON format with exactly these keys: "DetectedLanguage" (string, the language the user spoke), "Summary" (string, bilingual), "UrgencyMeter" (integer 1-10), "RecommendedDepartment" (string), "PreVisitAdvice" (array of strings, bilingual). Do NOT include markdown code block formatting or any extra text in your response.`;

  const userMessage = `Symptoms: ${symptoms}\nDuration: ${duration} days\nLanguage: ${language || 'English'}`;

  try {
    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: 'grok-beta', 
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.1
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROK_API_KEY}`
        },
        timeout: 10000 // 10 seconds timeout
      }
    );

    const content = response.data.choices[0].message.content.trim();
    // Parse JSON and handle possible markdown wrappers
    const jsonStr = content.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    const result = JSON.parse(jsonStr);

    return res.status(200).json({ success: true, report: result });
  } catch (error) {
    console.error('Error generating AI report:', error.message);
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return res.status(504).json({ success: false, message: 'Timeout' });
    }
    return res.status(500).json({ success: false, message: 'Failed to generate AI report' });
  }
});

module.exports = router;
