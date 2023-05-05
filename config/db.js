const mongoose = require('mongoose');
const mongooseRedisCaching = require("mongoose-redis-caching");

const connectDB = async () => {
  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${ conn.connection.host }`);
  mongooseRedisCaching(mongoose);
};

module.exports = connectDB;
