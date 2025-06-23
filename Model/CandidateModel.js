const mongoose = require('mongoose');
const validator = require('validator');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Candidate must have a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'A Candidate must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'A Candidate must have a password'],
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
  resume: String,
  role: {
    type: String,
    default: 'candidate',
    required: [true, 'A Candidate must have a role'],
    enum: ['candidate', 'admin']
  },
  active: {
    type: Boolean,
    default: true
  }
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;
