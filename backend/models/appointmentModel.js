const crypto = require('crypto');
const { pool } = require('../config/database');

/**
 * Helper function to standardise error responses
 */
const handleError = (context, error) => {
  console.error(`Error in ${context}:`, error);
  return { success: false, error: `Error during ${context}`, data: null };
};

/**
 * 1. Create a new appointment
 * @param {Object} patientData - Details about the patient and appointment
 * @returns {Object} JSON response with appointmentId and confirmationNumber
 */
async function createAppointment(patientData) {
  try {
    const appointmentId = crypto.randomUUID();
    // Generate a shorter 8-character uppercase alphanumeric confirmation number
    const confirmationNumber = crypto.randomBytes(4).toString('hex').toUpperCase();

    // Destructure required fields from patientData. 
    // Modify these fields based on your actual database schema.
    const { patientName, patientPhone, doctorId, appointmentDate, reason } = patientData;

    const query = `
      INSERT INTO appointments 
      (appointment_id, confirmation_number, patient_name, patient_phone, doctor_id, appointment_date, reason, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')
    `;

    // Parameterized queries (using ?) automatically prevent SQL injection
    const params = [
      appointmentId, 
      confirmationNumber, 
      patientName, 
      patientPhone, 
      doctorId || null, 
      appointmentDate, 
      reason || null
    ];

    await pool.execute(query, params);

    return { 
      success: true, 
      data: { appointmentId, confirmationNumber },
      // Maintaining top-level properties to strictly meet prompt requirements
      appointmentId, 
      confirmationNumber 
    };
  } catch (error) {
    return handleError('createAppointment', error);
  }
}

/**
 * 2. Get all appointments for a given patient by their phone number
 * @param {string} patientPhone 
 * @returns {Object} JSON response containing array of appointments
 */
async function getAppointmentByPatient(patientPhone) {
  try {
    const query = 'SELECT * FROM appointments WHERE patient_phone = ? ORDER BY appointment_date DESC';
    
    // Using execute for parameterized queries
    const [rows] = await pool.execute(query, [patientPhone]);
    
    return { success: true, data: rows, error: null };
  } catch (error) {
    return handleError('getAppointmentByPatient', error);
  }
}

/**
 * 3. Get a single appointment by its ID
 * @param {string} appointmentId 
 * @returns {Object} JSON response containing the single appointment object
 */
async function getAppointmentById(appointmentId) {
  try {
    const query = 'SELECT * FROM appointments WHERE appointment_id = ?';
    
    const [rows] = await pool.execute(query, [appointmentId]);
    
    const appointment = rows.length > 0 ? rows[0] : null;
    
    return { success: true, data: appointment, error: null };
  } catch (error) {
    return handleError('getAppointmentById', error);
  }
}

/**
 * 4. Update the status of an appointment
 * @param {string} appointmentId 
 * @param {string} newStatus 
 * @returns {Object} JSON response confirming update
 */
async function updateAppointmentStatus(appointmentId, newStatus) {
  try {
    const query = 'UPDATE appointments SET status = ? WHERE appointment_id = ?';
    
    const [result] = await pool.execute(query, [newStatus, appointmentId]);

    if (result.affectedRows === 0) {
      return { success: false, data: null, error: 'Appointment not found or no changes made' };
    }

    return { 
      success: true, 
      data: { updated: true }, 
      error: null,
      // Maintaining top-level property to strictly meet prompt requirements
      updated: true 
    };
  } catch (error) {
    return handleError('updateAppointmentStatus', error);
  }
}

module.exports = {
  createAppointment,
  getAppointmentByPatient,
  getAppointmentById,
  updateAppointmentStatus
};
