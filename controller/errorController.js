const AppError = require('./../util/appError');

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        err: err,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    if(err.isOpertational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else{
        // Programming or other errors do not leak to client
        // Log the error
        console.log('Error 💥:', err);

        res.status(500).json({
            status: 'Error',
            message: 'Something went wrong'
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';

    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if(process.env.NODE_ENV === 'production') {
        let error = {...err};

        error.message = err.message;
        error.name = err.name;
        error.code = err.code;
        error.keyValue = err.keyValue;

        sendErrorProd(error, res);
    }
};