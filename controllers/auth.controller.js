import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import createError from '../utils/createError.js';

const register = async (req, res, next) => {
  const { password } = req.body;

  try {
    const hashedPw = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPw
    });
    res.status(201).send('User created successfully!');
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) return next(createError(404, 'User not found'));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return next(createError(401, 'Wrong username and password combination!'));

    delete user._doc.password;

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller
      },
      process.env.JWT_KEY
    );

    res.cookie('accessToken', token, { httpOnly: true, sameSite: 'none', secure: true }).status(200).send(user);
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res) => {
  res
    .clearCookie('accessToken', { sameSite: 'none', secure: true })
    .status(200)
    .send('User successfully logged out!');
};

export { register, login, logout };
