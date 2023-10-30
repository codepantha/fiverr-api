import Conversation from '../models/conversation.model.js';
import createError from '../utils/createError.js';

export const index = async (req, res, next) => {
  try {
    const conversations = await Conversation.find(
      req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }
    ).sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  const {
    body: { to },
    userId
  } = req;

  const newConversation = new Conversation({
    sellerId: req.isSeller ? userId : to,
    buyerId: req.isSeller ? to : userId,
    readBySeller: !!req.isSeller,
    readByBuyer: !req.isSeller
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (err) {
    next(err);
  }
};

export const show = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ id: req.params.id });
    if (!conversation) return next(createError(404, 'Conversation not found!'));

    res.status(200).json(conversation);
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const updatedConversation = await Conversation.findOneAndUpdate(
      {
        id: req.params.id
      },
      {
        $set: {
          ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true })
        }
      },
      { new: true }
    );

    res.status(200).json(updatedConversation);
  } catch (err) {
    next(err);
  }
};
