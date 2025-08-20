const express = require('express');

const router = express.Router();
const { enrollCourse } = require('../controllers/enrollment.controller');
const { restrictToRole } = require('../middlewares/role.middleware');

router.post('/', restrictToRole('student'), enrollCourse);

module.exports = router;
