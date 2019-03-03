const route = require("express").Router();

route.use("/students", require('./students'));
module.exports = route;