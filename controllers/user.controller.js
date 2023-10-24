import User from '../models/user.model.js';
import createError from '../utils/createError.js';

export const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).send(user);
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send('User not found.')
    if (req.userId !== user._id.toString()) {
      return next(createError(403, 'You can only delete your own account.'))
    }

    await User.findByIdAndDelete(id);
    res.status(200).send('Deleted');
  } catch (err) {
    next(err);
  }
};
