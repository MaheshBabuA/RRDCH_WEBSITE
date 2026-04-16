const { feedback } = require('../models/data');

exports.submitFeedback = (req, res) => {
  const formData = req.body;
  const newFeedback = {
    ...formData,
    id: Date.now(),
    date: new Date().toISOString()
  };
  feedback.push(newFeedback);
  console.log('[Feedback Received]', newFeedback);
  res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
};
