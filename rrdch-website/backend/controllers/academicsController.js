const { academics } = require('../models/data');

exports.getAcademicsData = (req, res) => {
  res.status(200).json(academics);
};
