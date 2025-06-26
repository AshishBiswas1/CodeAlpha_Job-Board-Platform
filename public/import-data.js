const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./../Model/JobModel');

dotenv.config({ path: './../config.env' });

const DB = process.env.DATABASE.replace('<db_password>', process.env.PASSWORD);

mongoose.connect(DB).then(() => console.log('DB CONNECTED'));

// READ THE DATA
const jobData = JSON.parse(fs.readFileSync(`${__dirname}/job.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Job.create(jobData);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Job.deleteMany();
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
