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

    const { patientName, patientPhone, patientEmail, doctorId, appointmentDate, reason } = patientData;

    // 1. Find or Create Patient to get patient_id
    let patientId;
    const [existingPatient] = await connection.execute(
      'SELECT patient_id FROM patients WHERE patient_phone = ?',
      [patientPhone]
    );

    if (existingPatient.length > 0) {
      patientId = existingPatient[0].patient_id;
    } else {
      patientId = 'P-' + Math.floor(1000 + Math.random() * 9000);
      await connection.execute(
        'INSERT INTO patients (patient_id, patient_name, patient_phone, patient_email) VALUES (?, ?, ?, ?)',
        [patientId, patientName, patientPhone, patientEmail || null]
      );
    }

    // 3. Generate Verification Hash
    const verificationHash = crypto.createHash('sha256')
      .update(`${appointmentId}-${patientPhone}-${Date.now()}`)
      .digest('hex')
      .substring(0, 12);

    // 4. Insert Appointment
    const query = `
      INSERT INTO appointments 
      (appointment_id, confirmation_number, patient_id, patient_name, patient_phone, doctor_id, appointment_date, reason, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
    `;

    const params = [
      appointmentId, 
      confirmationNumber, 
      patientId,
      patientName, 
      patientPhone, 
      doctorId || null, 
      appointmentDate, 
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
      SELECT a.*, p.patient_id 
      FROM appointments a 
      JOIN patients p ON a.patient_phone = p.patient_phone 
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
