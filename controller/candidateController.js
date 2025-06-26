const Candidate = require('./../Model/CandidateModel');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/appError');

const multerStorage = multer.memoryStorage();

const uploadBoth = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image') ||
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(new AppError('Only images or PDFs allowed.', 400), false);
    }
  }
});

exports.resizeCandidatePhoto = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.image) return next();

  const imageFile = req.files.image[0];
  const filename = `candidate-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(imageFile.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/image/candidate/${filename}`);

  req.body.image = filename;
  next();
});

exports.saveCandidateResume = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.resume) return next();

  const resumeFile = req.files.resume[0];
  const filename = `user-${req.user.id}-${Date.now()}.pdf`;

  const resumePath = path.join(
    __dirname,
    '..',
    'public',
    'user-resume',
    filename
  );

  fs.writeFileSync(resumePath, resumeFile.buffer);
  req.user.resume = filename;
  next();
});

exports.uploadCandidateFiles = uploadBoth.fields([
  { name: 'image', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]);

const filterObj = (Obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(Obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = Obj[el];
    }
  });
  return newObj;
};

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
  const filteredBody = filterObj(req.body, 'name', 'email', 'resume');

  if (req.files && req.files.image) {
    filteredBody.image = req.body.image;
  }
  if (req.files && req.files.resume) {
    filteredBody.resume = req.body.resume;
  }

  const updatedEmployer = await Candidate.findByIdAndUpdate(
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
  await Candidate.findByIdAndUpdate(req.user.id, { active: false });

  res.status(200).json({
    status: 'Success',
    data: null
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;

  const user = await Candidate.findById(req.params.id);

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
