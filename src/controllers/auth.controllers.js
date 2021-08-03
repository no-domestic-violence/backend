/* eslint-disable arrow-parens */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/authentication';
import User from '../models/user.model';
import Error from '../middleware/error/ErrorHandler';
import verifyCaptcha from '../utils/captcha';

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
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    res
      .header('Authorization', `Bearer ${accessToken}`)
      .status(201)
      .send({
        user,
        accessToken,
        refreshToken,
        success: true,
        message: 'Signed up successfully!',
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
    const { email, password, captchaToken, platform } = req.body;
    if (process.env.NODE_ENV === 'production' && platform === 'web') {
      if (!captchaToken) {
        return res.status(400).send('Please solve the captcha');
      }
      const isCorrect = await verifyCaptcha(captchaToken);
      if (!isCorrect) {
        return res.status(400).send('Wrong captcha token provided');
      }
    }

    const user = await getUser(email, next);
    await validatePassword(user.password, password, next);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    res.header('Authorization', `Bearer ${accessToken}`).send({
      success: true,
      message: 'Logged in successfully!',
      accessToken,
      refreshToken,
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

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await User.findOneAndUpdate(
      { refreshToken },
      { refreshToken: '' },
      { new: true },
    );
    return res.status(200).json({ message: 'User logged out' });
  } catch (err) {
    return Error.internal('Internal Server Error');
  }
};

// refreshing access token
export const verifyRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      next(Error.unauthorized('No refresh token provided'));
      return;
    }
    const userWithRefreshToken = await User.findOne({ refreshToken });
    if (!userWithRefreshToken) {
      next(Error.unauthorized('Invalid refresh token'));
      return;
    }
    // extract payload from refresh token and generate a new access token, send it
    const payload = jwt.verify(
      userWithRefreshToken.refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET,
    );
    const newAccessToken = generateAccessToken(payload);
    return res.status(201).json({ accessToken: newAccessToken });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      next(Error.unauthorized('Refresh token expired'));
    } else {
      next(Error.internal('Something went wrong'));
    }
  }
};
