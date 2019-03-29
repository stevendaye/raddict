/* ## Setting up the app's routes ## */
const express = require("express");
const home = require("../controllers/home");
const post = require("../controllers/post");
const config =require("../config");

const router = express.Router();

const routes = app => {
  router.get("/", home.index);
  router.get(config.routes.post.add, post.index);
  router.post(config.routes.post.create, post.create);
  router.get(config.routes.post.view, post.view);
  router.get(config.routes.post.update, post.edit);
  router.get(config.routes.post.delete, post.delete);
  router.post(config.routes.post.deleteConfirm, post.deleteConfirmed);

  app.use(router);
};

module.exports = routes;
