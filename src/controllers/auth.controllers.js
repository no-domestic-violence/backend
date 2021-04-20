import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/authentication';
import User from '../models/user.model';
import Error from '../middleware/error/ErrorHandler';

//signup endpoint
export const assertUserExists = async (email, next) =>  {
  const userExist = await User.findOne({ email });
  if (userExist) {
    next(
      Error.badRequest('Email already exists'),
    );
    return;
  }  
}

export const createUser = async (username, email, password) => {
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  const user = new User({
    username: username,
    email: email,
    password: hashPassword,
  });

  return user
}

export const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(
        Error.unprocessableEntity('Please provide a valid username or password'),
      );
      return;
    }

    await assertUserExists(req.body.email, next)

    const user = await createUser(
      req.body.username,
      req.body.email,
      req.body.password,
    )
    
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
    res.status(201);
    res.send({
      success: true,
      user,
      token,
    });
  } catch (e) {
    next(
      Error.badRequest('The server can’t return a response due to an error'),
    );
  }
};

//login endpoint
export const getUser = async (email, next) => {
  const user = await User.findOne({ email });
  if (!user) {
    next(
      Error.notFound('User is not signed up'),
    );
    return;
  }

  return user
}
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(
        Error.unprocessableEntity('Please provide a valid username or password'),
      );
      return;
    }
    const user = await getUser(req.body.email, next)

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      next(
        Error.unauthorized('Invalid Email or Password'),
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
        Error.unauthorized('Old password is not correct'),
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
      { username: req.query.username },
    );
    if (!user) {
      next(
        Error.notFound('User not found'),
      );
      return;
    }
    res.status(202).json({ user, message: 'User was deleted!' });
  } catch (e) {
    res.send(e);
  }
};
