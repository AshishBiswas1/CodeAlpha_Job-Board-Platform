const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A job must have a title'],
      trim: true,
      unique: [true, 'Job title must be unique']
    },
    description: {
      type: String,
      required: [true, 'A job must have a description'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'A job must have a location'],
      trim: true
    },
    salary: {
      type: Number,
      required: [true, 'A job must have a salary'],
      trim: true
    },
    requirements: [
      {
        type: String,
        required: [true, 'A job must have requirements'],
        trim: true
      }
    ],
    employer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Employer',
      required: [true, 'A job must have an employer']
    }
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      }
    },
    toObject: { virtuals: true },
    timestamps: true
  }
);

jobSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'employer',
    select: 'name company'
  });
  next();
});

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
module.exports = Job;
