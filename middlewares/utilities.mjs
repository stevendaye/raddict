/* ## Creating the app's utilities ## */
import config from "../config";

const templateRoutes = (req, res, next) => {
  res.locals.routes = config.routes;
  next();
};

export { templateRoutes };
