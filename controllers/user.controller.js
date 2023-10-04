import jwt from 'jsonwebtoken';

import User from "../models/user.model.js";

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).send('You are unauthenticated.')

    jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
      if (payload.id !== user._id.toString()) {
        return res.status(200).send('You can only delete your own account.')
      }

      await User.findByIdAndDelete(id)
      res.status(200).send('Deleted')
    })
  } catch (err) {
    console.log(err)
  }
}
