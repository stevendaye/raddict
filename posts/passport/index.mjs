/* ## Setting Passport ## */
import "dotenv/config";
import passport from "passport";
import passportLocal from "passport-local";
import passportTwitter from "passport-twitter";
import passportFacebook from "passport-facebook";
import passportGoogle from "passport-google-oauth2";
import express from "express";
import DBG from "debug";
import util from "util";
import * as UsersModel from "../models/users/users-queries";
import config from "../config";

const debug = DBG("raddict:users-passport");
const error = DBG("raddict:error-passport");

const LocalStrategy = passportLocal.Strategy;
const TwitterStrategy = passportTwitter.Strategy;
const FacebookStrategy = passportFacebook.Strategy;
const GoogleStrategy = passportGoogle.Strategy;

const twitterCallback = process.env.TWITTER_CALLBACK_HOST
  ? process.env.TWITTER_CALLBACK_HOST
  : config.host;
const facebookCallback = process.env.FACEBOOK_CALLBACK_HOST
  ? process.env.FACEBOOK_CALLBACK_HOST
  : config.host;
const googleCallback = process.env.GOOGLE_CALBACK_HOST
  ? process.env.GOOGLE_CALBACK_HOST
  : config.host;

const router = express.Router();
const { auth, user } = config.routes;

// Configuring the Local authentication strategy
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    debug(`checkPassword: ${username}, ${password}`);
    let check = await UsersModel.checkPassword(username, password);
    if (check.check) {
      debug(`checkPassword authenticated with user service server: ${util.inspect(check)}`);
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

// Configuring Twitter Strategy
passport.use(new TwitterStrategy({
  consumerKey: config.twitter.consumerKey,
  consumerSecret: config.twitter.consumerSecret,
  callbackURL: `${twitterCallback}${auth.twitterAuthCallback}`,
  incluedEmail: true
}, async (token, tokenSecret, profile, done) => {
  try {
    done(null, await UsersModel.findOrCreate({
      id: profile.id, username: profile.username, password: profile.password,
      provider: profile.provider, familyName: profile.displayName, givenName: "",
      middleName: "", photos: profile.photos, emails: profile.email
    }));
  } catch (err) {
    done(err);
  }
}));

// Configuring Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: config.facebook.appID,
  clientSecret: config.facebook.appSecret,
  callbackURL: `${facebookCallback}${auth.facebookAuthCallback}`,
  profileFields: ["id", "displayName", "first_name", "last_name", "middle_name", "photos", "email"]
}, async (accessToken, refreshToken, profile, done) => {
  try {
    done(null, await UsersModel.findOrCreate({
      id: profile.id, username: profile.username, password: profile.password,
      provider: profile.provider, familyName: profile.name.familyName, givenName: profile.name.givenName,
      middleName: profile.name.middleName, photos: profile.photos, emails: profile.email
    }));
    debug(`Profile: ${util.inspect(profile)}`);
  } catch (err) {
    done(err);
  }
}));

// Configuring Google Strategy
passport.use(new GoogleStrategy({
  clientID: config.google.clientID,
  clientSecret: config.google.clientSecret,
  callbackURL: `${googleCallback}${auth.googleAuthCallback}`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    done(null, await UsersModel.findOrCreate({
      id: profile.id, username: profile.username, password: profile.password,
      provider: profile.provider, familyName: profile.displayName, givenName: "",
      middleName: "", photos: profile.photos, emails: profile.emails
    }));
  } catch (err) {
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
    if (user.found) {
      done(null, user.sanitize);
      debug(`deserializeUser Successfull. req.user is now available: ${util.inspect(user.sanitize)}`);
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
  router.post(user.login, (req, res, next) => {
    passport.authenticate("local", (err, user, feedback) => {
      if (err) {
        error(`authenitcate:local - Error Ocuured`);
        return next(err);
      }
      if (!user) {
        debug(`No user found for this credentials`);
        return res.render("login", { message: feedback.message });
      }
      req.login(user, err => {
        if (err) return next(err);
        return res.redirect("/");
      });
    })(req, res, next);
  });

  router.get(auth.twitterAuth, passport.authenticate("twitter"));
  router.get(auth.twitterAuthCallback, passport.authenticate("twitter", {
    successRedirect: "/",
    failureRedirect: user.login
  }));

  router.get(auth.facebookAuth, passport.authenticate("facebook"));
  router.get(auth.facebookAuthCallback, passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: user.login
  }));

  router.get(auth.googleAuth, passport.authenticate("google", {
    scope: ["email", "profile"]
  }));
  router.get(auth.googleAuthCallback, passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: user.login
  }));

  app.use(router);
};

export { passport, passportRoutes };
