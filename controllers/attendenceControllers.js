const Attendance = require('../models/Attendence');
const students = require('../utils/students');

exports.getAttendanceByDate = async (req, res) => {
  const date = req.params.date;

  const records = await Attendance.findAll({ where: { date } });

  // Merge fixed students + attendance
  const result = students.map(s => {
    const record = records.find(r => r.studentId === s.id);
    return {
      studentId: s.id,
      name: s.name,
      status: record ? record.status : null
    };
  });

  res.json(result);
};





exports.markAttendance = async (req, res) => {
  const { date, records } = req.body;

  const data = records.map(r => ({
    studentId: r.studentId,
    studentName: r.name,
    date,
    status: r.status
  }));

  await Attendance.bulkCreate(data);

  res.json({ message: "Attendance marked successfully" });
};



exports.getOverallAttendance = async (req, res) => {
  const records = await Attendance.findAll();

  const report = students.map(s => {
    const studentRecords = records.filter(r => r.studentId === s.id);
    const total = studentRecords.length;
    const present = studentRecords.filter(r => r.status === 'present').length;

    return {
      name: s.name,
      attended: present,
      totalClasses: total,
      percentage: total
        ? Math.round((present / total) * 100)
        : 0
    };
  });

  res.json(report);
};
