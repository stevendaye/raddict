/* #### Setting up Socket.IO for real time communication #### */
import socketio from "socket.io";
import passportSocketIo from "passport.socketio";
import cookieParser from "cookie-parser";
import { homeSocketio } from "../controllers/home";
import { sessionCookieName, sessionStore, sessionSecret } from "../app.mjs"

function startSocket (server) {
  const io = socketio.listen(server);
  io.use(passportSocketIo.authorize({
    store: sessionStore,
    secret: sessionSecret,
    cookieParser: cookieParser,
    key: sessionCookieName
  }));
  homeSocketio(io);
};

export { startSocket };
