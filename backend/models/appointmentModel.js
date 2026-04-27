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
 * Automatically handles patient creation/retrieval to get a patient_id
 * @param {Object} patientData - Details about the patient and appointment
 * @returns {Object} JSON response with appointmentId, confirmationNumber, and patientId
 */
async function createAppointment(patientData) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { patientName, patientPhone, patientEmail, departmentId, appointmentDate, appointmentTime, reason } = patientData;

    // 1. Find or Create Patient to get patient_id
    let patientId;
    const [existingPatient] = await connection.execute(
      'SELECT id FROM users WHERE phone = ?',
      [patientPhone]
    );

    if (existingPatient.length > 0) {
      patientId = existingPatient[0].id;
    } else {
      // Insert into users table
      const [result] = await connection.execute(
        'INSERT INTO users (role, name, phone, email) VALUES (?, ?, ?, ?)',
        ['patient', patientName, patientPhone, patientEmail || null]
      );
      patientId = result.insertId;
    }

    // 3. Generate Verification Hash
    const verificationHash = crypto.createHash('sha256')
      .update(`${appointmentId}-${patientPhone}-${Date.now()}`)
      .digest('hex')
      .substring(0, 12);

    // 4. Insert Appointment
    const query = `
      INSERT INTO appointments 
      (appointment_id, confirmation_number, patient_id, patient_name, patient_phone, department_id, appointment_date, appointment_time, notes, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled')
    `;

    const params = [
      appointmentId, 
      confirmationNumber, 
      patientId,
      patientName, 
      patientPhone, 
      departmentId, 
      appointmentDate, 
      appointmentTime,
      reason || null
    ];

    await connection.execute(query, params);
    await connection.commit();

    return { 
      success: true, 
      appointmentId, 
      confirmationNumber,
      patientId,
      verificationHash,
      data: { appointmentId, confirmationNumber, patientId, verificationHash }
    };

  } catch (error) {
    await connection.rollback();
    return handleError('createAppointment', error);
  } finally {
    connection.release();
  }
}

/**
 * 2. Get all appointments for a given patient by their phone number
 */
async function getAppointmentByPatient(patientPhone) {
  try {
    const query = `
      SELECT a.*, u.id as patient_id 
      FROM appointments a 
      JOIN users u ON a.patient_phone = u.phone 
      WHERE a.patient_phone = ? 
      ORDER BY a.appointment_date DESC
    `;
    const [rows] = await pool.execute(query, [patientPhone]);
    return { success: true, data: rows, error: null };
  } catch (error) {
    return handleError('getAppointmentByPatient', error);
  }
}

/**
 * 3. Get a single appointment by its ID
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
 */
async function updateAppointmentStatus(appointmentId, newStatus) {
  try {
    const query = 'UPDATE appointments SET status = ? WHERE appointment_id = ?';
    const [result] = await pool.execute(query, [newStatus, appointmentId]);
    if (result.affectedRows === 0) {
      return { success: false, data: null, error: 'Appointment not found or no changes made' };
    }
    return { success: true, updated: true };
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
