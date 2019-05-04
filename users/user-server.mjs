/* Setting the user REST Server */
import restify from "restify";
import DBG from "debug";
import util from "util";
import routes from "./routes";

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

routes(server);

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

export default check;
