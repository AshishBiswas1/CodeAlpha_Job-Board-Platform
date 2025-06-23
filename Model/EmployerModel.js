const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const employerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An Employer must have a name'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'An Employer must have a company name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'An Employer must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'An Employer must have a password'],
    minlength: 8,
    select: false
  },
  confirmpassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same'
    },
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    default: 'employer',
    enum: ['employer', 'Manager', 'HR']
  },
  active: {
    type: Boolean,
    default: true
  }
});

employerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bycript.hash(this.password, 12);
  this.confirmpassword = undefined;
  next();
});

const Employer = mongoose.model('Employer', employerSchema);
module.exports = Employer;
