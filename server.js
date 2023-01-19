const express = require('express');
const createError = require('http-errors');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');

var app = express();
require('dotenv').config({ path: path.resolve(__dirname + '/.env') });

var corsOptions = {
  origin: "*"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json({ limit: '50mb' }));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


app.use('/public', express.static(path.join(__dirname + '/public')));
app.use('/views', express.static(path.join(__dirname + '/views')));
app.use('/uploads', express.static(path.join(__dirname + '/uploads')));
app.use(logger('dev'));
// database

const db = require("./app/models");
//db.sequelize.sync();

app.get('/', (req, res) => {
  res.send("Welcome to Product Management RestAPI")
})
//routes
require("./app/routes/products/product.routes")(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return next(createError(404, "This resource was not found"));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(404).json({
    "status": false,
    "statuscode": err.status,
    "message": err.message
  });
});

var PORT = process.env.PORT || 8095;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);
});