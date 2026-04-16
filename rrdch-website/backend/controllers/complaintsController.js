const { complaints } = require('../models/data');

exports.getAllComplaints = (req, res) => {
  res.status(200).json(complaints);
};

exports.createComplaint = (req, res) => {
  const formData = req.body;
  const newComplaint = {
    ...formData,
    id: `CMP-${Math.floor(100000 + Math.random() * 900000)}`,
    status: 'open',
    date: new Date().toISOString().split('T')[0]
  };
  complaints.push(newComplaint);
  res.status(201).json({ success: true, complaintId: newComplaint.id });
};

exports.getComplaintsByPhone = (req, res) => {
  const { phone } = req.params;
  const filtered = complaints.filter(c => c.phone === phone);
  res.status(200).json(filtered);
};

exports.updateComplaintStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const index = complaints.findIndex(c => c.id === id);
  
  if (index !== -1) {
    complaints[index].status = status;
    return res.status(200).json({ success: true, complaint: complaints[index] });
  }
  
  res.status(404).json({ success: false, message: 'Complaint not found' });
};
