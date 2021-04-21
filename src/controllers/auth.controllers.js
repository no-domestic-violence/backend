import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/authentication';
import User from '../models/user.model';
import Error from '../middleware/error/ErrorHandler';

//signup endpoint
export const validationErrors = async (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(
      Error.unprocessableEntity('Please provide a valid username or password'),
    );
    return;
  }
}

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
    await validationErrors(req, next)
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

export const validatePassword = async (password, next) => {
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    next(
      Error.unauthorized('Invalid Email or Password'),
    );
    return;
  }
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
    await validatePassword(req.body.password, next)
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

export const assertPasswordExist = async (email, next) => {
  const user = await User.findOne({ email });
  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      next(
        Error.unauthorized('Old password is not correct'),
      );
      return;
    }
}



export const createNewPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(password, salt);
  const user = new User({
    password: hashedNewPassword,
  });
  return user
}

export const changePassword = async (req, res, next) => {
  try {
    const { email, oldPassword, password } = req.body;
    if (!email || !oldPassword) {
      next(
        Error.unprocessableEntity('Please provide email and password'),
      );
      return;
    }
    await assertPasswordExist(req.body.email, next)
    const user = await createNewPassword (req.body.password)
    await user.save();
    res.send('You updated the password');
  } catch (e) {
    next(e);
  }
};

//deleting account endpoint
export const getUserforDeletion = async (username, next) => {
  const user = await User.findOneAndDelete({ username });
  if (!user) {
    next(
      Error.notFound('User not found'),
    );
    return;
  }
  return user
}

export const deleteUser = async (req, res, next) => {
  try {
    const user = await getUserforDeletion(req.query.username, next)   
    res.status(202).json({ user, message: 'User was deleted!' });
  } catch (e) {
    res.send(e);
  }
};
