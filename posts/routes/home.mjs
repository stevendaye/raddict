/* ## Configuring the Index Route ## */
import home from "../controllers/home";
import express from "express";

const router = express.Router();

const homeRoute = app => {
  router.get("/", home.index);

  app.use(router);
};

export default homeRoute;
