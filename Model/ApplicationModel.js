const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.ObjectId,
      ref: 'Job'
    },
    candidate: {
      type: mongoose.Schema.ObjectId,
      ref: 'Candidate'
    },
    resume: {
      type: String,
      required: [true, 'An Application must have a resume']
    },
    status: {
      type: String,
      enum: [
        'applied',
        'under_review',
        'shortlisted',
        'interview_scheduled',
        'rejected',
        'hired'
      ],
      default: 'applied'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

applicationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'job',
    select: '-__v -createdAt -updatedAt'
  }).populate({
    path: 'candidate',
    select: '-__v -createdAt -updatedAt -resume'
  });
  next();
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
