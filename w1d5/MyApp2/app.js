var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const fs = require("fs");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var coursesRouter = require("./routes/courses.js");
var studentsRouter = require("./routes/students.js");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", (req, res, next) => {
  let x = req.method;
  let y = req.url;
  const toLog = { [y]: x };
  console.log(toLog);
  fs.appendFileSync("./access.log", `${JSON.stringify(toLog)}, `, (err) => {
    if (err) throw err;
    console.log("done");
  });
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/courses", coursesRouter);
app.use("/students", studentsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(5000);
// module.exports = app;
