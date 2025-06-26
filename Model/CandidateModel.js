const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
  },
  image: {
    type: String,
    default: 'default.jpg'
  },
  passwordChangedAt: {
    type: Date
  },
  passwordResetToken: {
    type: String
  },

  passwordResetExpiersAt: {
    type: Date
  }
});

candidateSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmpassword = undefined;

  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
  next();
});

candidateSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

candidateSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

candidateSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpiersAt = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;
