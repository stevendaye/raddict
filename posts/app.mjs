/* ## Setting Up the Server ## */
import "dotenv/config";
import http from "http";
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
import moment from "moment";
import { passport, passportRoutes } from "./passport";
import * as io from "./socket.io";
import config from "./config";
import homeRoute from "./routes/home";
import postsRoutes from "./routes/posts";
import usersRoutes from "./routes/users";
import imageRoutes from "./routes/images";
import * as errorHandler from "./middlewares/errorHandler";
import * as utils from "./middlewares/utilities";
import * as log from "./middlewares/log";
import dirname from "./dirname";
import * as miscellaneous from "./miscellaneous";

hbs.handlebars === import("handlebars");

const FileStore = sessionFileStore(session);
const sessionCookieName = "postscookie.sid";
const sessionSecret = config.secret;
const sessionStore = new FileStore({ path: "sessions" });

const debug = DBG("raddict:server-app");
const error = DBG("raddict:error-app");

// Workaround for the lack __dirname in ES6 modules
const { __dirname } = dirname;

const app = express();
const server = http.createServer(app);

var port = normalizePort(config.port);

app.set("port", config.port);
app.set("view engine", "hbs");
app.use(favicon(path.join(__dirname, "static", "raddictr.ico")));
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views/partials"));
hbs.registerHelper({
  wif(post, user, options) {
    return post === user
      ? options.fn(this)
      : options.inverse(this);
  },
  xif(rendered, local, options) {
    local = "local";
    return rendered === local
      ? options.fn(this)
      : options.inverse(this);
  },
  timeago(timestamp) {
    return moment(timestamp).startOf("seconds").fromNow();
  },
  profile(provider, id, gravatar) {
    switch (provider) {
      case "local":
        return gravatar;
      break;
      case "google":
        return gravatar;
      break;
      case "twitter":
        return gravatar;
      break;
      case "facebook":
        return `http://graph.facebook.com/'}${id}${"picture/"}?height=200`;
      break;
      default:
        return gravatar;
    }
  }
});
miscellaneous.dataFeathers(hbs);

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
  store: sessionStore,
  secret: sessionSecret,
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
homeRoute(app);
postsRoutes(app);
usersRoutes(app);
imageRoutes(app);
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

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

io.startSocket(server);

// Configuring the port
function normalizePort(val) {
  let port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  } // Named pipe
  if (port >= 0) {
    return port
  }
  return false;
}

// Event listeners for HTTP Server
function onError (error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  // Handling specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening () {
  let addr = server.address();
  let bind = typeof addr === "string" ? "Pipe " + addr : addr.port;
  debug("Server listening at http://localhost:" + bind);
}

export default app;
export { sessionCookieName, sessionStore, sessionSecret };

