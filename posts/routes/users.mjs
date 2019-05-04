/* ## Setting up users routes ## */
import express from "express";
import user from "../controllers/user";
import config from "../config.mjs";

const router = express.Router();

const usersRoutes = app => {
  router.get(config.routes.user.login, user.login);
  router.get(config.routes.user.logout, user.logout);
  router.get(config.routes.user.signup, user.signup);

  app.use(router);
};

export default usersRoutes;
