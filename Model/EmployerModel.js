const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const employerSchema = new mongoose.Schema(
  {
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
    },
    passwordChangedAt: {
      type: Date
    },
    passwordResetToken: {
      type: String
    },
    passwordResetExpiersAt: {
      type: Date
    },
    image: {
      type: String,
      default: 'default.jpg'
    }
  },
  {
    timestamps: true
  }
);

employerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmpassword = undefined;
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
  next();
});

employerSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

employerSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

employerSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpiersAt = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Employer = mongoose.model('Employer', employerSchema);
module.exports = Employer;
