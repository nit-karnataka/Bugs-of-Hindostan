const mongoose = require("mongoose");
const models = require('./models');

const CONFIG = require("./config2");

mongoose
	.connect(`mongodb://${CONFIG.DB.HOST}:${CONFIG.DB.PORT}/${CONFIG.DB.NAME}`, { useNewUrlParser: true })
	.then(() => {
		console.log("Database Ready for use!");
	})
	.catch(err => {
		console.log(`Error starting Database: ${err}`);
    });

module.exports = mongoose;