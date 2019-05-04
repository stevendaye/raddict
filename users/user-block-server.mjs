/* This user-block-server.mjs is exactly the same as user-sever.mjs except that it is in block*/
/* Just created this for debugging purpose because the user-server.mjs file was modularired */
/* Compare user-server.mjs to user-block-server.mjs */
import restify from "restify";
import util from "util"
import DBG from "debug";
import * as UsersModel from "./users-sequelize";
import config from "./config.mjs";

const log = DBG("raddict-users:service");
const logError = DBG("raddict-users:error");

// Creating a Restify Server
var server = restify.createServer({
  name: "User-Auth-Service",
  version: "0.0.1"
});

// Configuring handler functions to read HTTP basic headers & accept requests
server.use(restify.plugins.authorizationParser());
server.use(check);
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({
  mapParams: true
}));

// Creates a user record
server.post(config.routes.user.create, async (req, res, next) => {
  try {
    let result = await UsersModel.create(
      req.params.username, req.params.password, req.params.provider,
      req.params.familyName, req.params.givenName, req.params.middleName,
      req.params.emails, req.params.photos
    );
    log(`Created: ${util.inspect(result)}`);
    res.send(result);
    next(false);
  } catch (err) {
    res.send(500, err);
    logError(`${config.routes.user.create}: ${err.stack}`);
    next(false);
  }
});

// Updates an existing user record
server.post(config.routes.user.update, async (req, res, next) => {
  try {
    let result = await UsersModel.update(
      req.params.username, req.params.password, req.params.provider,
      req.params.familyName, req.params.givenName, req.params.middleName,
      req.params.emails, req.params.photos
    );
    res.send(UsersModel.sanitizedUser(result));
    log(`Updated: ${util.inspect(UsersModel.sanitizedUser(result))}`);
    next(false);
  } catch (err) {
    logError(`/update-user/${util.inspect(req.params.username)}: ${err.stack}`);
    res.send(500, err);
    next(false);
  }
});

// Find or Create a user record based on the profile information
server.post(config.routes.user.findOrCreate, async (req, res, next) => {
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
      emails: req.params.emails,
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
});

// Finds the user's data
server.get(config.routes.user.find, async (req, res, next) => {
  try {
    let user = await UsersModel.find(req.params.username);
    if (!user) {
      res.status(404).send(new Error(`Can't find user ${req.params.username}`));
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
});

// Deletes/Destroys a user record
server.del(config.routes.user.destroy, async (req, res, next) => {
  try {
    await UsersModel.destroy(req.params.username);
    res.send({});
    next(false);
  } catch (err) {
    res.send(500, err);
    logError(`/destroy/${req.params.username}: ${err.stack}`);
    next(false);
  }
});

// Checks the user's password
server.post(config.routes.user.checkPassword, async (req, res, next) => {
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
});

// Lists users in the database
server.get(config.routes.user.list, async (req, res, next) => {
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
});

// Server Listens on PORT=3333
server.listen(process.env.PORT, "localhost", () => {
  console.log(`User authentication server ${server.name} running at ${server.url}`);
});

// Mimicing API Key Autentication to have access to the user information server
var apiKeys = [{
  user: "team",
  key: "DHKHJ98N-UHG9-K09J-7YHD-8Q7LK98DHGS7"
}];

function check(req, res, next) {
  if (req.authorization && req.authorization.basic) {
    var BASICS_FOUND = false;
    for (let auth of apiKeys) {
      if (auth.key === req.authorization.basic.password
          && auth.user === req.authorization.basic.username) {
          BASICS_FOUND = true;
          break;
      }
    }
    if (BASICS_FOUND) {
      next();
      log(`Successfully Authenticated!`);
    } else {
      res.send(401, new Error("Not authenticated"));
      logError(`BASIC_FOUND=${BASICS_FOUND} - Not Autheticated!`);
      next(false);
    }
  } else {
    res.send(500, new Error("No Authorization Key Found"));
    logError(`No Authorization Key Found - ${util.inspect(req.authorization.basic)}`);
    next(false);
  }
}
