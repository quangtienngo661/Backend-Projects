const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);    