const mongoose = require("mongoose");

const lessonSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }
}, { timestamps: true });

module.exports = mongoose.model("Lesson", lessonSchema);