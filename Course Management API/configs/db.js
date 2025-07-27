const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB's connected")
    } catch (error) {
        console.log("Error connecting MongoDB: ", error.message)
        process.exit(1)
    }
}

module.exports = connectDB;