const { pool } = require('../config/database');
const crypto = require('crypto');

const handleError = (context, error) => {
  console.error(`Error in ${context}:`, error);
  return { success: false, error: `Error during ${context}`, data: null };
};

/**
 * Create a new hostel complaint
 * @param {Object} complaintData 
 * @returns {Object} JSON response confirming creation
 */
async function createComplaint(complaintData) {
  // Using a transaction for creation here as an example of transaction usage
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const complaintId = crypto.randomUUID();
    const { studentName, studentPhone, roomNumber, issue, category } = complaintData;

    const query = `
      INSERT INTO complaints 
      (complaint_id, student_name, student_phone, room_number, issue, category, status, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, 'PENDING', NOW())
    `;
    const params = [complaintId, studentName, studentPhone, roomNumber, issue, category];

    await connection.execute(query, params);
    await connection.commit();

    return { success: true, data: { complaintId }, error: null };
  } catch (error) {
    await connection.rollback();
    return handleError('createComplaint', error);
  } finally {
    connection.release();
  }
}

/**
 * Get complaints by a specific student using their phone
 * @param {string} studentPhone 
 * @returns {Object} JSON response with array of complaints
 */
async function getComplaintsByStudent(studentPhone) {
  try {
    const query = 'SELECT * FROM complaints WHERE student_phone = ? ORDER BY created_at DESC';
    const [rows] = await pool.execute(query, [studentPhone]);
    return { success: true, data: rows, error: null };
  } catch (error) {
    return handleError('getComplaintsByStudent', error);
  }
}

/**
 * Update the status of a complaint
 * @param {string} complaintId 
 * @param {string} status 
 * @returns {Object} JSON response confirming update
 */
async function updateComplaintStatus(complaintId, status) {
  try {
    const query = 'UPDATE complaints SET status = ? WHERE complaint_id = ?';
    const [result] = await pool.execute(query, [status, complaintId]);

    if (result.affectedRows === 0) {
      return { success: false, data: null, error: 'Complaint not found' };
    }

    return { success: true, data: { updated: true }, error: null };
  } catch (error) {
    return handleError('updateComplaintStatus', error);
  }
}

/**
 * Get a single complaint by ID
 * @param {string} complaintId 
 * @returns {Object} JSON response with the complaint details
 */
async function getComplaintById(complaintId) {
  try {
    const query = 'SELECT * FROM complaints WHERE complaint_id = ?';
    const [rows] = await pool.execute(query, [complaintId]);
    return { success: true, data: rows.length > 0 ? rows[0] : null, error: null };
  } catch (error) {
    return handleError('getComplaintById', error);
  }
}

module.exports = {
  createComplaint,
  getComplaintsByStudent,
  updateComplaintStatus,
  getComplaintById
};
