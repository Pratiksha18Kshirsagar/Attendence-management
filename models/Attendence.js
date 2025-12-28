// models/Attendance.js
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('present', 'absent'),
    allowNull: false
  }
}, {
  timestamps: false,
  // indexes: [
  //   {
  //     unique: true,
  //     fields: ['studentId', 'date']
  //   }
  // ]
});

module.exports = Attendance;
