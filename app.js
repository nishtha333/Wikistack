const express = require("express");
const morgan = require("morgan");

const app = express();
module.exports = app;

app.use(morgan("dev"));
app.use("/public", express.static(__dirname, "/public"));
app.use(require("body-parser").urlencoded({extended: false}));
app.use("/wiki", require("./routes/wiki"));
