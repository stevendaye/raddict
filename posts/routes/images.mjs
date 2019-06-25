import express from "express";
import image from "../controllers/image";
import * as utils from "../middlewares/utilities";
import config from "../config";

const router = express.Router();
const { post } = config.routes;

const imageRoutes = app => {
  router.get("/posts/images", image.index);
  router.get(post.image.add, [utils.requireAuthentication], image.add);
  router.post(post.image.create, [utils.requireAuthentication], image.create);
  router.get(post.image.view, image.view);
  router.post(post.image.like, [utils.requireAuthentication], image.like);
  router.post(post.image.likers, image.likers);
  router.get(post.image.delete, [utils.requireAuthentication], image.delete);
  router.post(post.image.deleteConfirm, [utils.requireAuthentication], image.deleteConfirmed);

  router.use(post.image.comment.make, [utils.requireAuthentication], image.makeComment);
  router.use(post.image.comment.like, [utils.requireAuthentication], image.likeComment);
  router.post(post.image.comment.delete, [utils.requireAuthentication], image.deleteComment);

  app.use(router);
};

export default imageRoutes;
