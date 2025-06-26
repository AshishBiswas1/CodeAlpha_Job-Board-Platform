const Employer = require('./../Model/EmployerModel');
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('./../util/appError');
const catchAsync = require('./../util/catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
exports.uploadEmployerPhoto = upload.single('image');

exports.resizeEmployerPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `employer-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/image/employer/${req.file.filename}`);

  next();
});

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

  if (req.file) filteredBody.image = req.file.filename;

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

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;

  const user = await Employer.findById(req.params.id);

  if (!user) {
    return next(new AppError('No Employer found by that Id', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      user
    }
  });
});
