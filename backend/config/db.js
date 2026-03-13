const mongoose = require('mongoose');

const connectDB = async () => {
  const options = {
    connectTimeoutMS: 10000, // 10 seconds
    serverSelectionTimeoutMS: 10000, // 10 seconds
  };

  const connectWithRetry = async (retries = 5) => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, options);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      if (retries > 0) {
        console.warn(`MongoDB connection failed: ${error.message}. Retrying... (${retries} left)`);
        setTimeout(() => connectWithRetry(retries - 1), 5000);
      } else {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
    }
  };

  await connectWithRetry();
};

module.exports = connectDB;
