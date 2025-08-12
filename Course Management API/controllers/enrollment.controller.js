const enrollmentService = require('../services/enrollment.service');

const enrollCourse = async (req, res, next) => {
  try {
    const studentEnrolled = await enrollmentService.enrollCourse(req, res, next);
    return res.ok(studentEnrolled)
  } catch (error) {
    res.fail(error)
  }
};

module.exports = { enrollCourse };
