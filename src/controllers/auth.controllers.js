/* eslint-disable arrow-parens */
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/authentication';
import User from '../models/user.model';
import Error from '../middleware/error/ErrorHandler';

// signup endpoint
export const assertUserExists = async (email, next) => {
  const userExist = await User.findOne({ email });
  if (userExist) {
    next(Error.badRequest('Email already exists'));
  }
};

export const createUser = async (username, email, password) => {
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  return new User({
    username,
    email,
    password: hashPassword,
  });
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
      .header('auth-token', token)
      .status(201)
      .send({ user, token, success: true, message: 'Signed up successfully!' });
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
