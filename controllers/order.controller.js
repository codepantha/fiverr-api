import Stripe from 'stripe';

import Gig from '../models/gig.model.js';
import Order from '../models/order.model.js';

export const index = async (req, res, next) => {
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

export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE);

  console.log('REQ ID', req.params.id);

  const gig = await Gig.findById(req.params.id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig.price * 100,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true
    }
  });

  const newOrder = new Order({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.userId,
    sellerId: gig.userId,
    price: gig.price,
    payment_intent: paymentIntent.id
  });

  await newOrder.save();
  res.status(201).json({
    clientSecret: paymentIntent.client_secret,
    order: newOrder
  });
};

export const confirmOrder = async (req, res, next) => {
  try {
    const order = await Order.findOneAndUpdate(
      { payment_intent: req.body.payment_intent },
      {
        $set: {
          isCompleted: true
        }
      }
    );

    res.status(200).send('Order has been confirmed.');
  } catch (err) {
    next(err);
  }
};
