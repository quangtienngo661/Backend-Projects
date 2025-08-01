const mongoose = require("mongoose");

const enrollmentSchema = mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', require: true },
    enrolledAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);    