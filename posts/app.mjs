/* ## Setting Up the Server ## */
import express from "express";
import session from "express-session";
import sessionFileStore from "session-file-store";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import hbs from "hbs";
import favicon from "serve-favicon";
import util from "util";
import logger from "morgan";
import path from "path";
import DBG from "debug";
import { passport, passportRoutes } from "./passport";
import config from "./config";
import postsRoutes from "./routes/posts";
import usersRoutes from "./routes/users";
import * as errorHandler from "./middlewares/errorHandler";
import * as utils from "./middlewares/utilities";
import * as log from "./middlewares/log";
import dirname from "./dirname";

const FileStore = sessionFileStore(session);
const sessionCookieName = "postscookie.sid";

const debug = DBG("raddict:debug");
const error = DBG("raddict:error");

// Workaround for the lack __dirname in ES6 modules
const { __dirname } = dirname;

const app = express();

app.set("port", config.port);
app.set("view engine", "hbs");
app.use(favicon(path.join(__dirname, "static", "favicon.ico")));
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views/partials"));

app.use(logger(process.env.REQUEST_LOG_FILE || "dev", {
  stream: log.logStream ? log.logStream : process.stdout
}));
app.use(express.static(__dirname + "/static"));
app.use("/assets/vendor/bootstrap", express.static(path.join(__dirname, "node_modules", "bootstrap", "dist")));
app.use("/assets/vendor/popper.js", express.static(path.join(__dirname, "node_modules", "popper.js", "dist")));
app.use("/assets/vendor/jquery", express.static(path.join(__dirname, "node_modules", "jquery")));
app.use("/assets/vendor/feather-icons", express.static(path.join(__dirname, "node_modules", "feather-icons", "dist")));
app.use(utils.templateRoutes);

app.use(cookieParser(config.secret));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  store: new FileStore({ path: "sessions" }),
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
  name: sessionCookieName
}));
app.use(passport.initialize());
app.use(passport.session());

// Enabling CORS Access from the server to be used by the user microservice server
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", config.postsHost);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// Providing the express app function to all routes
postsRoutes(app);
usersRoutes(app);
passportRoutes(app);

app.use(errorHandler.notFound);

// Handling Uncaught Exceptions and Unhandled Promise Rejection
process.on("uncaughtException", err => {
  error(`I crashed! - ${(err.stack || err)}`);
});

process.on("unhandledRejection", (reason, p) => {
  error(`Unhandled Promise Rejection at: ${util.inspect(p)} Reason: ${reason}`);
});

if (app.get("env") === "development") {
  app.use(errorHandler.err);
}

app.listen(config.port, () => {
  console.log(`Server running at http://127.0.0.1:${app.get("port")}`);
});

export default app;
export { sessionCookieName };
