const Candidate = require('./../Model/CandidateModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/appError');

exports.getAllCandidate = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.find();

  res.status(200).json({
    status: 'Success',
    data: {
      candidate
    }
  });
});

exports.getCandidate = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);

  if (!candidate) {
    return next(new AppError('No Candidate found by that Id!', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      candidate
    }
  });
});

exports.updateCandidate = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!candidate) {
    return next(new AppError('No Candidate found by that Id!', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      candidate
    }
  });
});

exports.removeCandidate = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findByIdAndDelete(req.params.id);

  if (!candidate) {
    return next(new AppError('No Candidate found by that Id!', 404));
  }

  res.status(204).json({
    status: 'Success',
    data: null
  });
});
