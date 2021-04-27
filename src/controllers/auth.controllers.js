/* eslint-disable arrow-parens */
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/authentication';
import User from '../models/user.model';
import Error from '../middleware/error/ErrorHandler';

// signup endpoint
export const validationErrors = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(
      Error.unprocessableEntity('Please provide a valid username or password'),
    );
  } else {
    next();
  }
};

export const assertUserExists = async (email, next) => {
  const userExist = await User.findOne({ email });
  if (userExist) {
    next(Error.badRequest('Email already exists'));
  }
};

export const createUser = async (username, email, password) => {
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  const user = new User({
    username,
    email,
    password: hashPassword,
  });
  return user;
};

export const requireAllfields = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    next(Error.badRequest('All fields are required'));
  } else {
    next();
  }
};

export const signup = async (req, res, next) => {
  try {
    await assertUserExists(req.body.email, next);
    const user = await createUser(
      req.body.username,
      req.body.email,
      req.body.password,
    );
    await user.save();
    const token = generateToken(user);
    res
      .status(201)
      .json({ user, success: true, message: 'Signed up successfully!' });
    res.send({
      token,
    });
  } catch (e) {
    next(Error.internal('The server can’t return a response due to an error'));
  }
};

// login endpoint
export const getUser = async (email, next) => {
  const user = await User.findOne({ email });
  if (!user) {
    next(Error.notFound('User is not signed up'));
    return;
  }
  return user;
};

export const validatePassword = async (currentPassword, password, next) => {
  const validPassword = await bcrypt.compare(password, currentPassword);
  if (!validPassword) {
    next(Error.unauthorized('Invalid Email or Password'));
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await getUser(req.body.email, next);
    await validatePassword(user.password, req.body.password, next);
    const token = generateToken(user);
    res.header('auth-token', token).send({
      success: true,
      message: 'Logged in successfully!',
      token,
      user,
    });
  } catch (e) {
    next(e);
  }
};
// changePassword endpoint
export const requireCredentials = async (req, res, next) => {
  const { email, oldPassword, password } = req.body;
  if (!email || !oldPassword || !password) {
    next(Error.badRequest('All fields are required'));
  } else {
    next();
  }
};

export const assertPasswordExist = async (oldPassword, newPassword, next) => {
  const isPasswordCorrect = await bcrypt.compare(oldPassword, newPassword);
  if (!isPasswordCorrect) {
    next(Error.unauthorized('Old password is not correct'));
  }
};

export const createNewPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(password, salt);

  return hashedNewPassword;
};

export const changePassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    await assertPasswordExist(req.body.oldPassword, user.password, next);
    const hashedNewPassword = await createNewPassword(req.body.password);
    user.password = hashedNewPassword;
    await user.save();
    res.send({ message: 'You updated the password' });
  } catch (e) {
    next(e);
  }
};

// deleting account endpoint
export const getUserforDeletion = async (username, next) => {
  const user = await User.findOneAndDelete({ username });
  if (!user) {
    next(Error.notFound('User not found'));
    return;
  }
  return user;
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await getUserforDeletion(req.query.username, next);
    res.status(202).json({ user, message: 'User was deleted!' });
  } catch (e) {
    res.send(e);
  }
};
