const Employer = require('./../Model/EmployerModel');
const AppError = require('./../util/appError');
const catchAsync = require('./../util/catchAsync');

const filterObj = (Obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(Obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = Obj[el];
    }
  });
  return newObj;
};

exports.getAllEmployers = catchAsync(async (req, res, next) => {
  const employer = await Employer.find();

  res.status(200).json({
    status: 'Success',
    data: {
      employer
    }
  });
});

exports.getOneEmployer = catchAsync(async (req, res, next) => {
  const employer = await Employer.findById(req.params.id);

  if (!employer) {
    return next(new AppError('No Employer found by that Id!', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      employer
    }
  });
});

exports.createEmployer = catchAsync(async (req, res, next) => {
  const employer = await Employer.create({
    name: req.body.name,
    company: req.body.company,
    email: req.body.email,
    password: req.body.password,
    confirmpassword: req.body.confirmpassword
  });

  res.status(201).json({
    status: 'Success',
    data: {
      employer
    }
  });
});

exports.updateEmployer = catchAsync(async (req, res, next) => {
  const employer = await Employer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!employer) {
    return next(new AppError('No Employer found by that Id!', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      employer
    }
  });
});

exports.removeEmployer = catchAsync(async (req, res, next) => {
  const employer = await Employer.findByIdAndDelete(req.params.id);

  if (!employer) {
    return next(new AppError('No Employer found by that Id!', 404));
  }

  res.status(204).json({
    status: 'Success',
    data: null
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Send Error if user POSTS password data
  if (req.body.password || req.body.confirmpassword) {
    return next(
      new AppError(
        'This path is to update user details, to update password use /updatePassword URL',
        400
      )
    );
  }

  // 2) Update user document
  const filteredBody = filterObj(req.body, 'name', 'company', 'email');
  const updatedEmployer = await Employer.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'Success',
    data: {
      user: updatedEmployer
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Employer.findByIdAndUpdate(req.user.id, { active: false });

  res.status(200).json({
    status: 'Success',
    data: null
  });
});
