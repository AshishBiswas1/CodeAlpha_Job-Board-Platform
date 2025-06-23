const Employer = require('./../Model/EmployerModel');
const Candidate = require('./../Model/CandidateModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/appError');
const jwt = require('jsonwebtoken');

const sendToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToke = (user, statusCode, res) => {
  const token = sendToken(user._id);
  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  user.password = undefined;
  res.status(statusCode).json({
    status: 'Success',
    token,
    data: {
      user
    }
  });
};

exports.Employersignup = catchAsync(async (req, res, next) => {
  const newUser = await Employer.create({
    name: req.body.name,
    email: req.body.email,
    company: req.body.company,
    password: req.body.password,
    confirmpassword: req.body.confirmpassword
  });

  createSendToke(newUser, 201, res);
});

exports.Employerlogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await Employer.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) send Token to client
  createSendToke(user, 200, res);
});
