const { events } = require('../models/data');

exports.getAllEvents = (req, res) => {
  res.status(200).json(events);
};

exports.getEventsByMonth = (req, res) => {
  const { month } = req.params;
  const filteredEvents = events.filter(e => e.date.includes(`-${month}-`));
  res.status(200).json(filteredEvents);
};
