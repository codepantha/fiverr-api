import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';

export const index = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    });
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const message = await Message.create({
      conversationId: req.body.conversationId,
      userId: req.userId,
      desc: req.body.desc
    });

    if (message) {
      await Conversation.findOneAndUpdate(
        { id: req.body.conversationId },
        {
          $set: {
            readBySeller: req.isSeller,
            readByBuyer: !req.isSeller,
            lastMessage: message.desc
          }
        },
        { new: true }
      );
    }
  } catch (err) {
    next(err);
  }
};
