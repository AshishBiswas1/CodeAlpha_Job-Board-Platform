const Application = require('./../Model/ApplicationModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/appError');

exports.getAllApplications = catchAsync(async (req, res, next) => {
  const applications = await Application.find();

  res.status(200).json({
    status: 'Success',
    data: {
      applications
    }
  });
});

exports.getApplication = catchAsync(async (req, res, next) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return next(new AppError('No Application found by that Id!', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      application
    }
  });
});

exports.apply = catchAsync(async (req, res, next) => {
  const application = await Application.create(req.body);

  res.status(200).json({
    status: 'Success',
    data: {
      application
    }
  });
});

exports.updateApplication = catchAsync(async (req, res, next) => {
  const application = await Application.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!application) {
    return next(new AppError('No Application found by that Id!', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      application
    }
  });
});

exports.removeApplication = catchAsync(async (req, res, next) => {
  const application = await Application.findByIdAndDelete(req.params.id);

  if (!application) {
    return next(new AppError('No Application found by that Id!', 404));
  }

  res.status(204).json({
    status: 'Success',
    data: null
  });
});
