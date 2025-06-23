const express = require('express');
const app = express();
const globalErrorHandeler = require('./controller/errorController');
const EmployerRouter = require('./Router/EmployerRouter');
const CandidateRouter = require('./Router/CandidateRouter');
const JobRouter = require('./Router/JobRouter');
const ApplicationRouter = require('./Router/ApplicationRouter');
const AppError = require('./util/appError');

if (process.env.NODE_EV === 'development') {
  app.use;
}

app.use(express.json({ limit: '50kb' }));

app.use('/api/Job_Board/employer', EmployerRouter);
app.use('/api/Job_Board/candidate', CandidateRouter);
app.use('/api/Job_Board/job', JobRouter);
app.use('/api/Job_Board/application', ApplicationRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandeler);

module.exports = app;
