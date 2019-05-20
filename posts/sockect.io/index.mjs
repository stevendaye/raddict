/* #### Setting up Socket.IO for real time communication #### */
import socketio from "socket.io";
import passportSocketIo from "passport.sockectio";
import cookieParser from "cookie-parser";
import { sessionCookieName, sessionSecret, sessionStore } from "../app.mjs"

const socketAuth = passportSocketIo.authorize({
  cookieParser: cookieParser,
  key: sessionCookieName,
  secret: sessionSecret,
  store: sessionStore
});

// Setting up Modules that needs the "io" object
const homeSockectio = io => {
  
};

const postsSockectio = io => {

};

const usersSockectio = io => {

};

function startSocket (server) {
  const io = socketio.listen(server);
  io.use(socketAuth);
  homeSockectio(io);
  postsSockectio(io);
  usersSockectio(io);
};

export { startSocket };
