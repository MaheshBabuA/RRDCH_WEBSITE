const { pool } = require('../config/database');

const handleError = (context, error) => {
  console.error(`Error in ${context}:`, error);
  return { success: false, error: `Error during ${context}`, data: null };
};

/**
 * Get all departments
 * @returns {Object} JSON response containing array of all departments
 */
async function getAllDepartments() {
  try {
    const query = 'SELECT * FROM departments';
    const [rows] = await pool.execute(query);
    return { success: true, data: rows, error: null };
  } catch (error) {
    return handleError('getAllDepartments', error);
  }
}

/**
 * Get a single department by ID
 * @param {string|number} id 
 * @returns {Object} JSON response containing the single department object
 */
async function getDepartmentById(id) {
  try {
    const query = 'SELECT * FROM departments WHERE department_id = ?';
    const [rows] = await pool.execute(query, [id]);
    return { success: true, data: rows.length > 0 ? rows[0] : null, error: null };
  } catch (error) {
    return handleError('getDepartmentById', error);
  }
}

module.exports = {
  getAllDepartments,
  getDepartmentById
};
