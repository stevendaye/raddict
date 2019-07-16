/* ## Setting up the home controller ## */
import util from "util";
import DBG from "debug";
import moment from "moment";
import * as posts from "../models/posts-model-type";

const log = DBG("raddict:homeposts-controllers");
const error = DBG("raddict:error-home-controllers");

export default {
  async index (req, res, next) {
    try {
      const postlist = await getAllPostList();
      if (req.user) log(`Successfully sent to index template req.user: ${util.inspect(req.user)}`);
      
      res.render("index", {
        title: "Raddict | Your Thoughts Sharing Platform ",
        postlist,
        user: req.user ? req.user : undefined
      });
    } catch (err) {
      error(`/ ERROR ${err.stack}`);
      next(err);
    }
  },

  async feeds (req, res, next) {
    res.render("feeds", {
      title: "Your feeds",
      user: req.user ? req.user : undefined
    });
  },
  
  async refresh (req, res, next) {
    try {
      const postlist = await getAllPostList();
      res.status(200).json({ postlist });
    } catch (err) {
      error(`/posts/refresh ${err.stack}`);
      next(err);
    }
  }
};

async function getAllPostList() {
  const keylist = await posts.keylist();
  const keyPromises = keylist.map( key =>
    posts.read(key).then( post => {
      return { key: post.key, username: post.username, provider: post.provider, familyname: post.familyname,
        gravatar: post.gravatar, title: post.title, body: post.body, views: post.views, likes: post.likes,
        likedBy: post.likedBy, timestamp: post.timestamp };
    }));
  return await Promise.all(keyPromises);
}

export function socketio(io) {
  const emitNewPost = async () => {
    const postlist = await getAllPostList();
    const freshpost = postlist[0];
    let data = {};
    data["post"] = {
      key: freshpost.key,
      username: freshpost.username,
      provider: freshpost.provider,
      familyname: freshpost.familyname,
      ugravatar: freshpost.gravatar,
      title: freshpost.title,
      body: freshpost.body,
      likes: freshpost.likes,
      views: freshpost.views,
      likedBy: freshpost.likedBy,
      timestamp: moment(freshpost.timestamp).startOf("seconds").fromNow()
    }
    io.of("/home").emit("newpost", data);
  };
  posts.events.on("postcreated", emitNewPost);
  posts.events.on("postupdated", emitNewPost);
  posts.events.on("postdestroyed", emitNewPost);
}
