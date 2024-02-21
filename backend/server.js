const connectDatabase = require("./DatabaseConnection/Database");
const app = require("./app");
//handeling errors
process.on("uncaughtException", (err) => {
  console.log(err.message);
  console.log("Shutting down the server ...");
});
//process env
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config();
}
//connect to database
connectDatabase();
//create server
const server = app.listen(process.env.PORT, () => {
  console.log("server listening on port", process.env.PORT);
});
//unhandeled promise rejection
process.on("unhandledRejection", (err) => {
  console.log("Unhandeled rejection");
  server.close(() => {
    process.exit(1);
  });
});
