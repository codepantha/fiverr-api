import mongoose from 'mongoose';

import createError from '../utils/createError.js';
import Review from '../models/review.model.js';
import Order from '../models/order.model.js';
import Gig from '../models/gig.model.js';

export const create = async (req, res, next) => {
  if (req.isSeller)
    return next(createError(403, "Seller can't create a review"));

  if (!(await boughtAnItem(req))) {
    return next(createError(403, "You haven't bought anything."));
  }

  if (await alreadyPostedReview(req)) {
    return next(
      createError(403, 'You have already created a review for this gig')
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const createdReview = await Review.create(
      [
        {
          gigId: req.body.gigId,
          userId: req.userId,
          star: req.body.star,
          desc: req.body.desc
        }
      ],
      { session: session }
    );

    // update the stars count on the gig
    await Gig.findByIdAndUpdate(
      req.body.gigId,
      {
        $inc: { totalStars: req.body.star, starNumber: 1 }
      },
      { session: session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(createdReview);
  } catch (err) {
    session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId });
    res.status(200).json(reviews)
  } catch (err) {
    next(err)
  }
}

const alreadyPostedReview = async (req) => {
  const review = await Review.findOne({
    gigId: req.body.gigId,
    userId: req.userId
  });

  if (review) return true;

  return false;
};

const boughtAnItem = async (req) => {
  const order = await Order.findOne({
    gigId: req.body.gigId,
    userId: req.userId
  });

  if (order) return true;

  return false;
};
