const { ConversationModel } = require("../models/ConversationModel");

const getConversation = async (currUserId) => {
  if (currUserId) {
    console.log("current USER ID:", currUserId);
    const currentUserCon = await ConversationModel.find({
      $or: [{ sender: currUserId }, { receiver: currUserId }],
    })
      .sort({ updatedAt: -1 })
      .populate("message")
      .populate("receiver")
      .populate("sender");

    const conversation = currentUserCon.map((con) => {
      const unSeenMsgCount = con?.message?.reduce((prev, curr) => {
          const messageByUserId = curr?.messageBy?.toString();

        if (messageByUserId !== currUserId) {
          return prev + (curr?.seen ? 0 : 1);
        } else {
          return prev;
        }
      }, 0);
      const lastMessage = con?.message[con?.message?.length - 1];
      return {
        _id: con?._id,
        sender: con?.sender,
        receiver: con?.receiver,
        unSeenMessage: unSeenMsgCount,
        lastMessage: lastMessage,
      };
    });
    return conversation;
  } else {
    return [];
  }
};

module.exports = getConversation;
