require('dotenv').config();
const mongoose = require('mongoose');

const ENV = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URL);
    console.log("MongoDB's connected");
  } catch (error) {
    console.log('Error connecting MongoDB: ', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
