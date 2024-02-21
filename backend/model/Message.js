const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var messageSchema = new mongoose.Schema(
  {
    members: {
      type: [],
    },
    lastMessage: {
      type: String,
    },
    groupTitle: {
      type: String,
    },
    lastMessageID: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Conversations", messageSchema);
