/* ## Setting up the app's routes ## */
const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

const routes = app => {
  router.get("/", controllers.index);

  app.use(router);
};

module.exports = routes;
