const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");
const {
  ConversationModel,
  MessageModel,
} = require("../models/ConversationModel");
const getConversation = require("../helpers/getConversation");

const app = express();

//SOCKET CONNECTION
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

//CHECKING USER IS ONLINE OR NOT
const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("CONNECTED USER:", socket.id);

  const token = socket.handshake.auth.token;
  const user = await getUserDetailsFromToken(token);
  //   console.log('user:', user);

  //CREATING ROOM
  socket.join(user?._id?.toString());
  onlineUser.add(user?._id?.toString());

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    console.log("USER ID:", userId);
    const userDetails = await UserModel.findById(userId).select("-password");
    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser.has(userId),
    };

    socket.emit("message-user", payload);

    //getting previous message
    const getConversationMsg = await ConversationModel.findOne({
      $or: [
        {
          sender: user?._id,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: user?._id,
        },
      ],
    })
      .populate("message")
      .sort({ updatedAt: -1 });

    //previous message
    socket.emit("message", getConversationMsg?.message);
  });

  // new message
  socket.on("new-message", async (data) => {
    // check conversation is available for user
    let conversation = await ConversationModel.findOne({
      $or: [
        {
          sender: data?.sender,
          receiver: data?.receiver,
        },
        {
          sender: data?.receiver,
          receiver: data?.sender,
        },
      ],
    });

    // IF CONVERSATION IS NOT AVAILABLE
    if (!conversation) {
      const createConversation = await ConversationModel({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
    }

    const message = new MessageModel({
      text: data?.text,
      imageUrl: data?.imageUrl,
      videoUrl: data?.videoUrl,
      messageBy: data?.messageBy,
    });

    const saveMessage = await message.save();

    const updateConversation = await ConversationModel.updateOne(
      {
        _id: conversation?.id,
      },
      {
        $push: {
          message: saveMessage?._id,
        },
      }
    );

    const getConversationMsg = await ConversationModel.findOne({
      $or: [
        {
          sender: data?.sender,
          receiver: data?.receiver,
        },
        {
          sender: data?.receiver,
          receiver: data?.sender,
        },
      ],
    })
      .populate("message")
      .sort({ updatedAt: -1 });

    io.to(data?.sender).emit("message", getConversationMsg?.message);
    io.to(data?.receiver).emit("message", getConversationMsg?.message);

    const conversationSender = await getConversation(data?.sender);
    const conversationReceiver = await getConversation(data?.receiver);

    io.to(data?.sender).emit("conversation", conversationSender);
    io.to(data?.receiver).emit("conversation", conversationReceiver);
  });

  //SIDEBAR
  socket.on("sidebar", async (currUserId) => {
    const conversation = await getConversation(currUserId);
    socket.emit("conversation", conversation);
  });

  socket.on("seen", async (msgByUserId) => {
    let conversation = await ConversationModel.findOne({
      $or: [
        {
          sender: user?._id,
          receiver: msgByUserId,
        },
        {
          sender: msgByUserId,
          receiver: user?._id,
        },
      ],
    });

    const conversationMsgId = conversation?.message || [];
    const updateMessage = await MessageModel.updateMany(
      {
        _id: { $in: conversationMsgId },
        messageBy: msgByUserId,
      },
      {
        $set: { seen: true },
      }
    );

    const conversationSender = await getConversation(user?._id?.toString());
    const conversationReceiver = await getConversation(msgByUserId);

    io.to(user?._id?.toString()).emit("conversation", conversationSender);
    io.to(msgByUserId).emit("conversation", conversationReceiver);
  });

  //DISCONNECT
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id?.toString());
    console.log("USER DISCONNECTED:", socket.id);
  });
});

module.exports = {
  app,
  server,
};
