const express = require('express');
const router = express.Router();
const { getAttendanceByDate, markAttendance, getOverallAttendance } = require('../controllers/attendenceControllers');

router.get('/attendance/overall', getOverallAttendance);
router.get('/attendance/:date', getAttendanceByDate);
router.post('/attendance', markAttendance);


module.exports = router;
