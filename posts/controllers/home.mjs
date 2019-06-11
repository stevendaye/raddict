/* ## Setting up the home controller ## */
import util from "util";
import DBG from "debug";
import * as posts from "../models/posts-model-type";

const log = DBG("raddict:homeposts-socket.io");
const error = DBG("raddict:error-socket.io");

export default {
  async index (req, res, next) {
    try {
      const postlist = await getKeyTitlesList();
      if (req.user) log(`Successfully sent to index template req.user: ${util.inspect(req.user)}`);
      
      res.render("index", {
        title: "Raddict | Your Thoughts Sharing Platform ",
        fakecrumb: "Crumb",
        postlist,
        user: req.user ? req.user : undefined
      });
    } catch (err) {
      next(err);
    }
  }
};

async function getKeyTitlesList() {
  const keylist = await posts.keylist();
  const keyPromises = keylist.map( key =>
    posts.read(key).then( post => {
      return { key: post.key, username: post.username, familyname: post.familyname,
        gravatar: post.gravatar, title: post.title, body: post.body, timestamp: post.timestamp };
    }));
  return Promise.all(keyPromises);
}

export function socketio(io) {
  const emitPostTitles = async () => {
    const postlist = await getKeyTitlesList();
    io.of("/home").emit("postitles", { postlist });
  };
  posts.events.on("postcreated", emitPostTitles);
  posts.events.on("postupdated", emitPostTitles);
  posts.events.on("postdestroyed", emitPostTitles);
}
