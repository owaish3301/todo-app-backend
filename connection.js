require('dotenv').config();

const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_CONNECTION_URI;

function connectMongo() {
  mongoose.connect(mongoUri).then(() => {
    console.log("Mongo db connected successfully!!");
  });
}

module.exports = { connectMongo };
