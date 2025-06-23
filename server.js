const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
    console.log('UNHANDLED Exception!💥 SHUTTING DOWN...');
    console.log(err.name, err.message);
    process.exit(1);
  });

// CHECK IF DATABASE IS LOADED
if (!process.env.DATABASE || !process.env.PASSWORD) {
    console.error('DATABASE_URL OR DATABASE_PASSWORD IS MISSING IN THE .ENV');
    process.exit(1);
}
  

const DB = process.env.DATABASE.replace('<db_password>', process.env.PASSWORD);
mongoose.connect(DB).then(() => console.log('DB connection successful!'));

const app = require('./app');

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`);
});

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION!💥 SHUTTING DOWN...');
    server.close(() => {
      process.exit(1);
    });
  });
  