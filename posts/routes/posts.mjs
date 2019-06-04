/* ## Setting up posts routes ## */
import express from "express";
import post from "../controllers/post";
import * as utils from "../middlewares/utilities";
import config from "../config";

const router = express.Router();
const { routes } = config;

const postsRoutes = app => {
  router.get(routes.post.add, utils.requireAuthentication, post.index);
  router.post(routes.post.create, utils.requireAuthentication, post.create);
  router.get(routes.post.view, post.view);
  router.get(routes.post.update, utils.requireAuthentication, post.edit);
  router.get(routes.post.delete, utils.requireAuthentication, post.delete);
  router.post(routes.post.deleteConfirm, utils.requireAuthentication, post.deleteConfirmed);

  router.use(routes.post.comment.like, utils.requireAuthentication, post.likeComment);
  router.use(routes.post.comment.make, utils.requireAuthentication, post.makeComment);
  router.post(routes.post.comment.delete, utils.requireAuthentication, post.deleteComment);

  app.use(router);
};

export default postsRoutes;
