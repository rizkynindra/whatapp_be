import createHttpError from "http-errors";
import logger from "../configs/logger.config.js";
import {
  createConversation,
  doesConversationExist,
  getUserConversations,
  populateConversation,
} from "../services/conversation.service.js";

export const create_open_conversation = async (req, res, next) => {
  console.log(req.body);
  try {
    const sender_id = req.user.userId;
    const { receiver_id, isGroup } = req.body;
    if (isGroup == false) {
      //check if receiver_id is provided
      if (!receiver_id) {
        logger.error(
          "please provide the user id you wanna start a conversation with !"
        );
        throw createHttpError.BadGateway("Oops...Something went wrong !");
      }
      //check if chat exists
      const existed_conversation = await doesConversationExist(
        sender_id,
        receiver_id,
        false
      );
      if (existed_conversation) {
        res.json(existed_conversation);
      } else {
        // let receiver_user = await User(receiver_id);
        let convoData = {
          name: "conversation name",
          picture: "conversation picture",
          isGroup: false,
          users: [sender_id, receiver_id],
        };
        const newConvo = await createConversation(convoData);
        const populatedConvo = await populateConversation(
          newConvo._id,
          "users",
          "-password"
        );
        res.status(200).json(populatedConvo);
      }
    } else {
      console.log("hnaaaaaaaaaa");
      //it's a group chat
      //check if group chat exists
      const existed_group_conversation = await doesConversationExist(
        "",
        "",
        isGroup
      );
      res.status(200).json(existed_group_conversation);
    }
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const conversations = await getUserConversations(user_id);
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

