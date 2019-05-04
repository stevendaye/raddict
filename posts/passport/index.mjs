/* ## Setting Passport ## */
import passport from "passport";
import passportLocal from "passport-local";
import express from "express";
import DBG from "debug";
import util from "util";
import * as UsersModel from "../models/users/users-queries";
import config from "../config";

const debug = DBG("raddict:users-passport");
const error = DBG("raddict:error-passport");

const localStrategy = passportLocal.Strategy;
const router = express.Router();

// Configuring the Local authentication strategy
passport.use(new localStrategy(async (username, password, done) => {
  try {
    debug(`checkPassword: ${username}, ${password}`);
    let check = await UsersModel.checkPassword(username, password);
    if (check.check) {
      debug(`checkPassword authenticated with user servie server: ${util.inspect(check)}`);
      done(null, { id: check.username, username: check.username });
    } else {
      debug(`checkPassword not authenticate user with the authentication service: ${util.inspect(check)}`);
      done(null, false, { message: check.message });
    }
  } catch (err) {
    error(`checkPassword threw an error: ${err.stack}`);
    done(err);
  }
}));

// Encoding and decoding authentication data for the session
passport.serializeUser((user, done) => {
  try {
    done(null, user.username);
    debug(`serializeUser Successfull`);
  } catch (err) {
    error(`serializeUser Error: ${err.stack}`);
    done(err);
  }
});

passport.deserializeUser(async (username, done) => {
  try {
    let user = await UsersModel.find(username);
    if (user) {
      done(null, user);
      debug(`deserializeUser Successfull. req.user is now available: ${util.inspect(user)}`);
    } else {
      done(null, false, { message: `Coudn't fund ${username}` });
      debug(`Could not find such a user`);
    }
  } catch (err) {
    error(`deserializeUser Error: ${err.stack}`);
    done(err);
  }
});

const passportRoutes = app => {
  router.post(config.routes.user.login, (req, res, next) => {
    passport.authenticate("local", (err, user, feedback) => {
      if (err) {
        error(`authenitcate:local - Error Ocuured`);
        return next(err);
      }
      if (!user) {
        debug(`No user found`);
        return res.render("login", { message: feedback.message });
      }
      req.login(user, err => {
        if (err) return next(err);
        return res.redirect("/");
      });
    })(req, res, next);
  });

  app.use(router);
};

export { passport, passportRoutes };
