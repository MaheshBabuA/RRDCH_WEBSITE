const { appointments } = require('../models/data');

exports.getAllAppointments = (req, res) => {
  res.status(200).json(appointments);
};

exports.createAppointment = (req, res) => {
  const formData = req.body;
  const newAppointment = {
    ...formData,
    id: `APT-${Math.floor(10000 + Math.random() * 90000)}`,
    status: 'scheduled',
    confirmationNumber: `${formData.department.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`
  };
  appointments.push(newAppointment);
  res.status(201).json({ success: true, appointment: newAppointment });
};

exports.getAppointmentsByPhone = (req, res) => {
  const { phone } = req.params;
  const filtered = appointments.filter(a => a.phone === phone);
  res.status(200).json(filtered);
};

exports.updateAppointmentStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const index = appointments.findIndex(a => a.id === id);
  
  if (index !== -1) {
    appointments[index].status = status;
    return res.status(200).json({ success: true, appointment: appointments[index] });
  }
  
  res.status(404).json({ success: false, message: 'Appointment not found' });
};
