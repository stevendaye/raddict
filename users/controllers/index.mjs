import util from "util"
import DBG from "debug";
import * as UsersModel from "../users-sequelize";
import config from "../config";
import md5 from "md5";

const log = DBG("raddict-users:service");
const logError = DBG("raddict-users:error");

export default {
  // Create a new user
  async create(req, res, next) {
    try {
      const profileCreatedAt = new Date();
      
      let result = await UsersModel.create(
        req.params.username, req.params.password, req.params.provider,
        req.params.familyName, req.params.givenName, req.params.middleName,
        req.params.gender, req.params.birthday,
        md5(req.params.username), req.params.displayPicture,
        profileCreatedAt,
        req.params.email, req.params.photos
      );
      log(`Created: ${util.inspect(result)}`);
      res.send(result);
      next(false);
    } catch (err) {
      res.send(500, err);
      logError(`${config.routes.user.create}: ${err.stack}`);
      next(false);
    }
  },

  // Update an existing user record
  async update(req, res, next) {
    try {
      let result = await UsersModel.update(
        req.params.username, req.params.password, req.params.provider,
        req.params.familyName, req.params.givenName, req.params.middleName,
        req.params.gender, req.params.birthday,
        req.params.gravatar, req.params.displayPicture,
        req.params.profileCreatedAt,
        req.params.email, req.params.photos
      );
      res.send(UsersModel.sanitizedUser(result));
      log(`Updated: ${util.inspect(UsersModel.sanitizedUser(result))}`);
      next(false);
    } catch (err) {
      res.send(500, err);
      logError(`/update-user/${util.inspect(req.params.username)}: ${err.stack}`);
      next(false);
    }
  },

  // Find a user, if not create one based on the given profile information
  async findOrCreate(req, res, next) {
    log(`find-or-create ${util.inspect(req.params)}`);
    try {
      let result = await UsersModel.findOrCreateProfile({
        id: req.params.username,
        username: req.params.username,
        password: req.params.password,
        provider: req.params.provider,
        familyName: req.params.familyName,
        givenName: req.params.givenName,
        middleName: req.params.middleName,
        gender: req.params.gender,
        birthday: req.params.birthday,
        gravatar: req.params.gravatar,
        displayPicture: req.params.displayPicture,
        profileCreatedAt: new Date(),
        emails: req.params.email,
        photos: req.params.photos
      });
      log(`find-or-create: ${util.inspect(result)}`);
      res.send(result);
      next(false)
    } catch (err) {
      res.send(500, err);
      logError(`${config.routes.user.findOrCreate}: ${err.stack}`);
      next(false);
    }
  },

  // Find the user data. This does not return password
  async find(req, res, next) {
    try {
      let user = await UsersModel.find(req.params.username);
      if (!user) {
        res.send(404 ,new Error(`Can't find user ${req.params.username}`));
        next(false);
      } else {
        res.send(user);
        next(false);
      }
    } catch (err) {
      res.send(500, err);
      logError(`/find/${req.params.username}: ${err.stack}`);
      next(false);
    }
  },

  // Deleting an existing user
  async destroy(req, res, next) {
    try {
      await UsersModel.destroy(req.params.username);
      res.send({});
      next(false);
    } catch (err) {
      res.send(500, err);
      logError(`/destroy/${req.params.username}: ${err.stack}`);
      next(false);
    }
  },

  // Check User Password
  async checkPassword(req, res, next) {
    try {
      let checked = await UsersModel.userCheckPassword(req.params.username, req.params.password);
      log(`checkPassword result=${util.inspect(checked)}`);
      res.contentType = "json";
      res.send(checked);
      next(false)
    } catch (err) {
      res.send(500, err);
      logError(`${config.routes.user.checkPassword}: ${err.stack}`);
      next(false);
    }
  },

  // List Users
  async list(req, res, next) {
    try {
      let userlist = await UsersModel.listUsers();
      if (!userlist) {
        userlist = [];
      }
      log(`List: ${util.inspect(userlist)}`);
      res.contentType = "json";
      res.send(userlist);
      next(false);
    } catch (err) {
      res.send(500, err);
      logError(`${config.routes.user.list}: ${err.stack}`);
      next(false);
    }
  }
}
