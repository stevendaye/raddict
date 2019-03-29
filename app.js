/* ## Setting Up the Server ## */
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const hbs = require("hbs");
const favicon = require("serve-favicon");
const logger = require("morgan");
const path = require("path");
const config = require("./config");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.set("port", config.port);
app.set("view engine", "hbs");
app.use(favicon(path.join(__dirname, "static", "favicon.ico")));
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views/partials"));

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.secret));
app.use(express.static(__dirname + "/static"));

routes(app);

app.use(errorHandler.notFound);
app.use(errorHandler.err);

app.listen(config.port, () => {
  console.log("Server running at http://127.0.0.1:3000");
});
