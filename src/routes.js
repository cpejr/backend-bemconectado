const express = require("express");
const { celebrate } = require("celebrate");
const routes = express.Router();

const adminController = require("./controllers/adminController");
const adminValidator = require("./validators/adminValidator");

const categController = require("./controllers/categController");
const categValidator = require("./validators/categValidator");

const counterController = require("./controllers/counterController");
const counterValidator = require("./validators/counterValidator");

const driveController = require("./controllers/driveController");

const ongController = require("./controllers/ongController");
const ongValidator = require("./validators/ongValidator");

const sessionController = require("./controllers/sessionController");
const sessionValidator = require("./validators/sessionValidator");

const ongDB = require("./models/ongModel");
const imageUpload = require("./middleware/imageUpload");
const authentication = require("./middleware/authentication");

//ONGS
routes.post("/ongs", imageUpload("imageFile"), ongController.create);
//routes.put('/UpdateImage', imageUpload('imageFile'), ongController.create);
routes.get("/ongs", celebrate(ongValidator.index), ongController.index);
routes.get("/ongsCount", celebrate(ongValidator.totalApproved), ongController.totalApproved);

//COUNT
routes.post("/registerAcess/:id", celebrate(counterValidator.registerCount), counterController.registerCount);
routes.get("/monthViews", counterController.getRecentCount);

//SESSION
routes.post("/session", celebrate(sessionValidator.login), sessionController.login);
routes.get("/validateCredentials", driveController.validateCredentials);

//ADMIN
routes.get("/admin", celebrate(adminValidator.index), authentication.authenticateToken, adminController.index);
routes.put("/admin/:ongId", celebrate(adminValidator.update), authentication.authenticateToken, adminController.update);
routes.delete("/admin/:ongId",celebrate(adminValidator.delete), authentication.authenticateToken, ongController.delete);

//CATEGORY
routes.get("/categ", celebrate(categValidator.index), categController.index);
routes.post("/categ", celebrate(categValidator.create), authentication.authenticateToken, categController.create);
routes.put("/categ", celebrate(categValidator.categorize), authentication.authenticateToken, categController.categorize);
routes.delete("/categ/:name", celebrate(categValidator.delete), authentication.authenticateToken, categController.delete);

//CATEGORY SEARCH
//Will find all categories of an Ong with its ID as a param.
routes.get("/categ/:ongId", celebrate(categValidator.searchCategs), categController.searchCategs);
//Will find all categories of an Ong with its ID as a param.
routes.get("/ongcateg", celebrate(categValidator.searchOngs), categController.searchOngs);

module.exports = routes;
