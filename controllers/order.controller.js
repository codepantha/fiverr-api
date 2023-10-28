import Gig from '../models/gig.model.js';
import Order from '../models/order.model.js';

export const index = async (req, res, next) => {
  console.log({ 'USER ID': req.userId, 'IS SELLER': req.isSeller})
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.isSeller } : { buyerId: req.userId }),
      isCompleted: true
    });

    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  const gig = await Gig.findById(req.body.gigId);

  const newOrder = new Order({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.userId,
    sellerId: gig.userId,
    price: gig.price,
    payment_intent: 'temporary'
  })

  await newOrder.save();
  res.status(201).json(newOrder)
}
