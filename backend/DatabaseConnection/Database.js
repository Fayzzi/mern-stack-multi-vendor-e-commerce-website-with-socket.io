const mongoose = require("mongoose");
const connectDatabase = () => {
  mongoose.connect(process.env.MONGOOSE).then((data) => {
    console.log(`Connected to database:${data.connection.host}`);
  });
};
module.exports = connectDatabase;
