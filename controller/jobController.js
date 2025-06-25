const Job = require('./../Model/JobModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/appError');

exports.getAllJobs = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  console.log(JSON.parse(queryStr));

  console.log(req.query, queryObj);
  const query = Job.find(JSON.parse(queryStr));

  const jobs = await query;

  res.status(200).json({
    status: 'Success',
    total: jobs.length,
    data: {
      jobs
    }
  });
});

exports.getJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new AppError('No Job found by that Id!', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      job
    }
  });
});

exports.createJob = catchAsync(async (req, res, next) => {
  const newJob = await Job.create({
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    salary: req.body.salary,
    requirements: req.body.requirements,
    employer: req.body.employer
  });

  res.status(201).json({
    status: 'Success',
    data: {
      job: newJob
    }
  });
});

exports.updateJobPofile = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!job) {
    return next(new AppError('No Job found by that Id!', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      job
    }
  });
});

exports.removeJobProfile = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndDelete(req.params.id);

  if (!job) {
    return next(new AppError('No Job found by that Id!', 404));
  }

  res.status(204).json({
    status: 'Success',
    data: null
  });
});
