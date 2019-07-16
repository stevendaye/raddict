/* ## Configuring the Index Route ## */
import express from "express";
import * as utils from "../middlewares/utilities.mjs";
import home from "../controllers/home";
import config from "../config.mjs";

const { post } = config.routes;

const router = express.Router();

const homeRoute = app => {
  router.get("/", home.index);
  router.get(config.routes.feeds, [utils.requireAuthentication], home.feeds);
  router.post(post.refresh, home.refresh);

  app.use(router);
};

export default homeRoute;
