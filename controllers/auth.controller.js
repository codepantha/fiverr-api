import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';

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
    res.status(500).json({ msg: 'something went wrong' });
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) return res.status(404).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).send('Wrong username and password combination!');

    delete user._doc.password;

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller
      },
      process.env.JWT_KEY
    );

    res.cookie('accessToken', token, { httpOnly: true }).status(200).send(user);
  } catch (err) {
    res.status(500).send('Something went wrong');
  }
};

export { register, login };
