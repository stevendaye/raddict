/* ## Creating the app's utilities ## */
import util from "util";
import DBG from "debug";
import config from "../config";

const debug = DBG(`raddict:posts-utilities`);
const error = DBG(`raddict:error-utilities`);

const templateRoutes = (req, res, next) => {
  res.locals.routes = config.routes;
  next();
};

// Passport authentication middleware
const requireAuthentication = (req, res, next) => {
  try {
    if (req.user) {
      debug(`req.session.passport: ${util.inspect(req.session.passport)}`);
      debug(`req.cookies: ${req.cookies}`);
      next();
    } else {
      res.redirect(config.routes.user.login);
    }
  } catch (err) {
    error(`requireAuthentication: Error Occured!`);
    next(err);
  }
};

export { templateRoutes, requireAuthentication };
