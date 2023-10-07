import Gig from '../models/gig.model.js';
import createError from '../utils/createError.js';

export const index = async (req, res, next) => {
  const query = req.query;

  const filters = buildFilters(query);

  try {
    const gigs = await Gig.find(filters);
    res.status(200).json({ gigs, hits: gigs.length});
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, 'Only sellers can create a gig!'));

  const newGig = new Gig({
    ...req.body,
    userId: req.userId
  });

  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    next(err);
  }
};

export const show = async (req, res, next) => {
  try {
    const gig = await Gig.findOne({ _id: req.params.id });
    if (!gig) return next(createError(404, 'Gig not found!'));
    res.status(200).json(gig);
  } catch (err) {
    next(err);
  }
};

export const destroy = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) return next(createError(404, 'Gig not found.'));
    if (gig.userId !== req.userId)
      return next(createError(403, 'You can only delete your own gig!'));

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send('Gig has been deleted!');
  } catch (err) {
    next(err);
  }
};

const buildFilters = (query) => {
  const filters = {};

  if (query.userId) filters.userId = query.userId;
  if (query.cat) filters.cat = query.cat;

  if (query.min || query.max) {
    filters.price = {};
    if (query.min) filters.price.$gte = query.min;
    if (query.max) filters.price.$lte = query.max;
  }

  if (query.search) {
    filters.title = {
      $regex: query.search,
      $options: 'i'
    };
  }

  return filters;
}
