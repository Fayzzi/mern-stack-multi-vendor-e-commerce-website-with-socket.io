const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var singleMessage = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    images: {
      type: [String],
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Messages", singleMessage);
