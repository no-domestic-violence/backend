import { check } from 'express-validator';
import jwt from 'jsonwebtoken';

const signupValidation = [
  check('username')
    .isLength({ min: 2 })
    .withMessage('Your username is required'),
  check('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Your password must be at least eight charachters'),
];

const generateToken = (user) => jwt.sign(
  {
    _id: user._id, email: user.email, username: user.username, role: user.role,
  },
  'JWT_SECRET',
);

const loginValidation = [
  check('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Your password must be at least eight charachters'),
];

export { signupValidation, loginValidation, generateToken };
