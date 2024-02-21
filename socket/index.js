const socketIO = require("socket.io");
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");

const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(express.json());

app.use("/", (req, res) => {
  res.json({
    message: "Homepage",
  });
});

server.listen(4000, () => {
  console.log("listening on server");
});

let users = [];

io.on("connection", (socket) => {
  console.log("a user is connected");

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getAllUsers", users);
  });

  const messages = {};

  socket.on("sendMessage", ({ senderId, recieverId, text, images }) => {
    const newMessage = createMessage({ senderId, recieverId, text, images });

    const recieverUser = getUser(recieverId);
    if (!messages[recieverId]) {
      messages[recieverId] = [newMessage];
    } else {
      messages[recieverId].push(newMessage);
    }

    // Emit the new message event to the recipient as notification on recieverUser
    io.to(recieverUser?.socketId).emit("newMessage", newMessage);
  });

  socket.on("messageseen", ({ senderId, recieverId, messageId }) => {
    const senderUser = getUser(senderId);
    if (messages[senderId]) {
      const message = messages[senderId].find(
        (m) => m.recieverId === recieverId && m.id === messageId
      );
      if (message) {
        message.seen = true;
        io.to(senderUser?.socketId).emit("messageseen", {
          senderId,
          recieverId,
          messageId,
        });
      }
    }
  });

  socket.on("updateLastmessage", ({ lastMessage, lastmessageid }) => {
    io.emit("getLastmessage", {
      lastMessage,
      lastmessageid,
    });
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    removeUser(socket.id);
    io.emit("getAllUsers", users);
  });
});

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const createMessage = ({ senderId, recieverId, text, images }) => ({
  senderId,
  recieverId,
  text,
  images,
  seen: false,
});

const getUser = (recieverId) => {
  return users.find((user) => user.userId === recieverId);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
