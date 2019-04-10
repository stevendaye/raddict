/* ## Creating the app's utilities ## */
const config = require("../config");

const templateRoutes = (req, res, next) => {
  res.locals.routes = config.routes;
  next();
};

module.exports.templateRoutes = templateRoutes;
