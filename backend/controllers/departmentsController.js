const { departments } = require('../models/data');

exports.getAllDepartments = (req, res) => {
  res.status(200).json(departments);
};

exports.getDepartmentById = (req, res) => {
  const { id } = req.params;
  const department = departments.find(d => d.id === id);
  
  if (!department) {
    return res.status(404).json({ success: false, message: 'Department not found' });
  }

  // Simulate "related" departments as seen in mockApi
  const related = departments
    .filter(d => d.id !== id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  res.status(200).json({ department, related });
};
