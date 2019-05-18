/* ## Setting up the user controller ## */
import path from "path";
import util from "util";
import DBG from "debug";
import * as UsersModel from "../models/users/users-queries";
import { sessionCookieName } from "../app";
import config from "../config.mjs";

const debug = DBG("raddict:router-users");
const error = DBG("raddict:error-users");

export default {
  login (req, res, next) {
    try {
      res.render("login", { title: "Login to Raddict", user: req.user });
    } catch (err) {
      next(err);
    }
  },

  logout (req, res, next) {
    try {
      req.session.destroy();
      req.logout();
      res.clearCookie(sessionCookieName);
      debug(`User Logged Out Successfully!`);
      res.redirect("/");
    } catch (err) {
      next(err);
      error(`Something went wrong when logging out user`);
    }
  },

  signup (req, res, next) {
    try {
      res.render("signup", { title: "Sign Up", user: req.user });
    } catch (err) {
      next(err);
    }
  }
}
