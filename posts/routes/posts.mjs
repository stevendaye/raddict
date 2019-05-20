/* ## Setting up posts routes ## */
import express from "express";
import post from "../controllers/post";
import * as utils from "../middlewares/utilities";
import config from "../config";

const router = express.Router();

const postsRoutes = app => {
  router.get(config.routes.post.add, utils.requireAuthentication, post.index);
  router.post(config.routes.post.create, utils.requireAuthentication, post.create);
  router.get(config.routes.post.view, post.view);
  router.get(config.routes.post.update, utils.requireAuthentication, post.edit);
  router.get(config.routes.post.delete, utils.requireAuthentication, post.delete);
  router.post(config.routes.post.deleteConfirm, utils.requireAuthentication, post.deleteConfirmed);

  app.use(router);
};

export default postsRoutes;
