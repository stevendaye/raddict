/* ## Setting up users routes ## */
import express from "express";
import user from "../controllers/user";
import config from "../config.mjs";

const { routes } = config;
const router = express.Router();

const usersRoutes = app => {
  router.get(routes.user.list, user.list);
  router.get(routes.user.login, user.login);
  router.get(routes.user.logout, user.logout);
  router.get(routes.user.signup, user.signup);

  app.use(router);
};

export default usersRoutes;
