const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../models/User");
const { findOne } = require("../models/User");//??

const validate = [
	check("username")
		.isLength({ min: 2 })
		.withMessage("Your username is required"),
	check("email").isEmail().withMessage("Please provide a valid email address"),
	check("password")
		.isLength({ min: 8 })
		.withMessage("Your password must be at least eight charachters"),
];

const generateToken = (user) => {
	return jwt.sign(
		{ _id: user._id, email: user.email, username: user.username },
		"SECRET_KEY"
	);
};

const loginValidation = [
	check("email").isEmail().withMessage("Please provide a valid email address"),
	check("password")
		.isLength({ min: 8 })
		.withMessage("Your password must be at least eight charachters"),
];

router.post("/signup", validate, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const userExist = await User.findOne({ email: req.body.email });
	if (userExist)
		return res
			.status(400)
			.send({ success: false, message: "Email already exists" });

	const salt = await bcrypt.genSalt();
	const hashPassword = await bcrypt.hash(req.body.password, salt);

	const user = new User({
		username: req.body.username,
		email: req.body.email,
		password: hashPassword,
	});
	try {
		// create and assign a token
		const token = generateToken(user);
		res.send({
			success: true,
			user,
			token,
		});
	} catch (error) {
		res.status(400).send({ success: false, error });
	}
});

router.post("/login", loginValidation, async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const user = await User.findOne({ email: req.body.email });

	if (!user)
		return res
			.status(404)
			.send({ success: false, message: "User is not signed up" });

	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword)
		return res
			.status(404)
			.send({ success: false, message: "Invalid Email or Password" });

	const token = generateToken(user);

	res
		.header("auth-token", token)
		.send({ success: true, message: "Logged in successfully !", token, user });
});

module.exports = router;
