const { default: mongoose } = require("mongoose");
require("dotenv").config();


const dbConnect = async () => {
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/cuahangdientu', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });;
    if (conn.connection.readyState === 1) {
      console.log("Database is connected successfully!");
    }else {
      console.log("Database is connecting...");

    }
  } catch (error) {
    console.log("DB connection is failed");
    throw new Error(error);
  }
};

module.exports = dbConnect;
