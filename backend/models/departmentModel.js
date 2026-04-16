const { pool } = require('../config/database');

const handleError = (context, error) => {
  console.error(`Error in ${context}:`, error);
  return { success: false, error: `Error during ${context}`, data: null };
};

// Static fallback list to ensure the API always functions, even if the database is unseeded
const staticDepartments = [
  { department_id: 1, name: "Oral Medicine & Radiology" },
  { department_id: 2, name: "Prosthetics & Crown & Bridge" },
  { department_id: 3, name: "Oral & Maxillofacial Surgery" },
  { department_id: 4, name: "Periodontology" },
  { department_id: 5, name: "Pedodontics & Preventive Dentistry" },
  { department_id: 6, name: "Conservative Dentistry & Endodontics" },
  { department_id: 7, name: "Orthodontics & Dentofacial Orthopedics" },
  { department_id: 8, name: "Public Health Dentistry" },
  { department_id: 9, name: "Oral & Maxillofacial Pathology" },
  { department_id: 10, name: "Implantology" },
  { department_id: 11, name: "Research & Publication" },
  { department_id: 12, name: "Orofacial Pain" }
];

/**
 * Get all departments
 * @returns {Object} JSON response containing array of all departments
 */
async function getAllDepartments() {
  try {
    const query = 'SELECT * FROM departments';
    const [rows] = await pool.execute(query);
    
    // Return database values if present
    if (rows && rows.length > 0) {
      return { success: true, data: rows, error: null };
    }
    
    // Fallback to static data if table is empty
    return { success: true, data: staticDepartments, error: null };
  } catch (error) {
    // If the table doesn't exist yet, smoothly fallback to static data
    console.warn("Returning static departments (Database error or unseeded table)");
    return { success: true, data: staticDepartments, error: null };
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
    
    if (rows && rows.length > 0) {
      return { success: true, data: rows[0], error: null };
    }
    
    // Fallback
    const dept = staticDepartments.find(d => d.department_id == id);
    return { success: true, data: dept || null, error: null };
  } catch (error) {
    console.warn(`Returning static department for ID ${id} (Database error or unseeded table)`);
    const dept = staticDepartments.find(d => d.department_id == id);
    return { success: true, data: dept || null, error: null };
  }
}

module.exports = {
  getAllDepartments,
  getDepartmentById,
  staticDepartments
};
