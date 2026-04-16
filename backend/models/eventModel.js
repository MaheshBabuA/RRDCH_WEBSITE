const { pool } = require('../config/database');

const handleError = (context, error) => {
  console.error(`Error in ${context}:`, error);
  return { success: false, error: `Error during ${context}`, data: null };
};

/**
 * Get events occurring from today onwards
 * @returns {Object} JSON response containing upcoming events
 */
async function getUpcomingEvents() {
  try {
    // Queries all events where the date is greater than or equal to current database date
    const query = 'SELECT * FROM events WHERE event_date >= CURDATE() ORDER BY event_date ASC';
    const [rows] = await pool.execute(query);
    return { success: true, data: rows, error: null };
  } catch (error) {
    return handleError('getUpcomingEvents', error);
  }
}

/**
 * Get events strictly in a specific month/year
 * @param {string} monthYear - formatted ideally like "YYYY-MM"
 * @returns {Object} JSON response containing matching events
 */
async function getEventsByMonth(monthYear) {
  try {
    // Checks if the date string starts with the YYYY-MM
    const query = 'SELECT * FROM events WHERE DATE_FORMAT(event_date, "%Y-%m") = ? ORDER BY event_date ASC';
    const [rows] = await pool.execute(query, [monthYear]);
    return { success: true, data: rows, error: null };
  } catch (error) {
    return handleError('getEventsByMonth', error);
  }
}

module.exports = {
  getUpcomingEvents,
  getEventsByMonth
};
