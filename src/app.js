const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
//const morgan = require("morgan");
const bodyParser = require("body-parser");
//routes
//const routes = require('./app/routes/routes');
const path = require('path');
//const debug = require('debug');

//app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static('./public'));
app.set('view engine', 'pug');
app.set("views", path.join(__dirname, "app", "views"));

// Header settings
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("X-Powered-By", "Custom Engine");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header('X-Frame-Options', 'SAMEORIGIN');
  res.header('Strict-Transport-Security','max-age=31536000; includeSubDomains');
  res.header('X-Content-Type-Options','nosniff');
  res.header('X-XSS-Protection','1; mode=block');
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes handle requests

//app.use("/", routes);


// Error handle requests
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.status || 500).send();
  /* res.json({
      error: {
          message: error.message
      }
  }); */
});

module.exports = app;
