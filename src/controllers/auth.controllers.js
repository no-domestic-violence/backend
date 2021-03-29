import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/authentication';
import User from '../models/user.model';
import Error from '../middleware/error/ErrorHandler';

export const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(
        Error.unprocessableEntity('Please provide a valid username or password'),
      );
      return;
    }
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      next(
        Error.badRequest('Email already exists'),
      );
      return;
    }
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      next(
        Error.badRequest('All fields are required'),
      );
      return;
    }
    await user.save();
    // create and assign a token
    const token = generateToken(user);
    res.send({
      success: true,
      user,
      token,
    });
  } catch (e) {
    res.status(400).send({ success: false, e });
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(
        Error.unprocessableEntity('Please provide a valid username or password'),
      );
      return;
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      next(
        Error.notFound('User is not signed up'),
      );
      return;
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      next(
        Error.notFound('Invalid Email or Password'),
      );
      return;
    }
    const token = generateToken(user);
    res.header('auth-token', token).send({
      success: true,
      message: 'Logged in successfully !',
      token,
      user,
    });
  } catch (e) {
    next(e);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { email, oldPassword, password } = req.body;
    if (!email || !oldPassword) {
      next(
        Error.unprocessableEntity('Please provide email and password'),
      );
      return;
    }
    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      next(
        Error.notFound('Old password is not correct'),
      );
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(password, salt);

    user.password = hashedNewPassword;
    await user.save();
    res.send('You updated the password');
  } catch (e) {
    next(e);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndDelete(
      { username: req.query },
    );
    if (!user) {
      next(
        Error.badRequest('User not found'),
      );
      return;
    }
    res.status(202).json({ user, message: 'User was deleted!' });
  } catch (e) {
    res.send(e);
  }
};
