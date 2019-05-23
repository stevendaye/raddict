/* #### Setting up Socket.IO for real time communication #### */
import socketio from "socket.io";
import passportSocketIo from "passport.socketio";
import cookieParser from "cookie-parser";
import { socketio as homeSocketio } from "../controllers/home";
import { socketio as postSocketio } from "../controllers/post";
import { sessionCookieName, sessionStore, sessionSecret } from "../app.mjs"

function startSocket (server) {
  const io = socketio(server);
  io.use(passportSocketIo.authorize({
    store: sessionStore,
    secret: sessionSecret,
    cookieParser: cookieParser,
    key: sessionCookieName
  }));
  homeSocketio(io);
  postSocketio(io);
};

export { startSocket };
