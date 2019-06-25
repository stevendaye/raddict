/* ## Configuring the Index Route ## */
import home from "../controllers/home";
import express from "express";
import config from "../config.mjs";

const { post } = config.routes;

const router = express.Router();

const homeRoute = app => {
  router.get("/", home.index);
  router.post(post.refresh, home.refresh);

  app.use(router);
};

export default homeRoute;
