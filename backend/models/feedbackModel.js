const { pool } = require('../config/database');
const crypto = require('crypto');

const handleError = (context, error) => {
  console.error(`Error in ${context}:`, error);
  return { success: false, error: `Error during ${context}`, data: null };
};

/**
 * Submit newly provided feedback
 * @param {Object} feedbackData 
 * @returns {Object} JSON response confirming submission
 */
async function submitFeedback(feedbackData) {
  try {
    const feedbackId = crypto.randomUUID();
    const { userPhone, category, rating, comments } = feedbackData;

    const query = `
      INSERT INTO feedback (feedback_id, user_phone, category, rating, comments, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const params = [feedbackId, userPhone, category, rating, comments];

    await pool.execute(query, params);

    return { success: true, data: { feedbackId }, error: null };
  } catch (error) {
    return handleError('submitFeedback', error);
  }
}

/**
 * Get all feedback (typically for admin use)
 * @returns {Object} JSON response with array of all feedback
 */
async function getAllFeedback() {
  try {
    const query = 'SELECT * FROM feedback ORDER BY created_at DESC';
    const [rows] = await pool.execute(query);
    return { success: true, data: rows, error: null };
  } catch (error) {
    return handleError('getAllFeedback', error);
  }
}

module.exports = {
  submitFeedback,
  getAllFeedback
};
