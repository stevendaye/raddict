/* ## Setting up the app's routes ## */
import express from "express";
import home from "../controllers/home";
import post from "../controllers/post";
import config from "../config";
import * as utils from "../middlewares/utilities";

const router = express.Router();

const routes = app => {
  app.use(utils.templateRoutes);

  router.get("/", home.index);
  router.get(config.routes.post.add, post.index);
  router.post(config.routes.post.create, post.create);
  router.get(config.routes.post.view, post.view);
  router.get(config.routes.post.update, post.edit);
  router.get(config.routes.post.delete, post.delete);
  router.post(config.routes.post.deleteConfirm, post.deleteConfirmed);

  app.use(router);
};

export default routes;
