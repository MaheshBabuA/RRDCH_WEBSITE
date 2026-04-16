const { pool } = require('../config/database');

const handleError = (context, error) => {
  console.error(`Error in ${context}:`, error);
  return { success: false, error: `Error during ${context}`, data: null };
};

/**
 * Pull all doctors and their statuses
 * @returns {Object} JSON response containing array of all doctors
 */
async function getAllDoctors() {
  try {
    const query = 'SELECT * FROM doctors ORDER BY doctor_name ASC';
    const [rows] = await pool.execute(query);
    return { success: true, data: rows, error: null };
  } catch (error) {
    return handleError('getAllDoctors', error);
  }
}

/**
 * Get all doctors within a particular department
 * @param {string|number} departmentId 
 * @returns {Object} JSON response containing array of relevant doctors
 */
async function getDoctorsByDepartment(departmentId) {
  try {
    const query = 'SELECT * FROM doctors WHERE department_id = ? ORDER BY doctor_name ASC';
    const [rows] = await pool.execute(query, [departmentId]);
    return { success: true, data: rows, error: null };
  } catch (error) {
    return handleError('getDoctorsByDepartment', error);
  }
}

/**
 * Adjust the currently tracking queue values for a specific doctor
 * @param {string} doctorId 
 * @param {number} patientCount 
 * @returns {Object} JSON response confirming doctor queue updates
 */
async function updateDoctorQueue(doctorId, patientCount) {
  try {
    const query = 'UPDATE doctors SET current_queue_count = ? WHERE doctor_id = ?';
    const [result] = await pool.execute(query, [patientCount, doctorId]);

    if (result.affectedRows === 0) {
      return { success: false, data: null, error: 'Doctor not found' };
    }

    return { success: true, data: { updated: true }, error: null };
  } catch (error) {
    return handleError('updateDoctorQueue', error);
  }
}

module.exports = {
  getAllDoctors,
  getDoctorsByDepartment,
  updateDoctorQueue
};
