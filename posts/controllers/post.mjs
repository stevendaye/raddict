/* ## Setting up the post controller ## */
import util from "util";
import DBG from "debug";
import uuid from "uuid/v4";
import * as posts from "../models/posts-model-type";
import * as comments from "../models/posts-comments-sequelize.mjs";
import * as errorHandler from "../middlewares/errorHandler";
import config from "../config";

const debug = DBG("raddict:post-controllers");
const error = DBG("raddict:error-post-controllers");
const { routes } = config;

export default {
  add (req, res, next) {
    try {
      res.render("post_edit", {
        title: "Raddict | Post A Thought",
        docreate: true,
        postkey: "",
        post: undefined,
        user: req.user ? req.user : undefined,
        likes: "",
        views: "",
        likedBy: [],
        timestamp: ""
      });
    } catch (err) {
      error(`${routes.post.add} ERROR ${err.stack}`);
      next(err);
    }
  },

  async create (req, res, next) {
    // This controller is used for both creating and updating posts
    try {
      let post;
      const postkey = uuid();
      const likes = 0, views = 0, likedBy = [];
      const timestamp = new Date();
      if (req.body.title && req.body.body) {
        if (req.body.docreate === "create") {
          post = await posts.create(postkey, req.body.username, req.body.provider, req.body.familyname,
            req.body.gravatar, req.body.title, req.body.body, likes, views, likedBy, timestamp);
        } else {
          post = await posts.update(req.body.postkey, req.body.username, req.body.provider, req.body.familyname,
            req.body.gravatar, req.body.title, req.body.body, req.body.likes, req.body.views, req.body.likedBy, req.body.timestamp);
        }
        res.redirect(`${routes.post.view}?key=${post.key}`);
      } else {
        return res.render("post_edit", { message: "You must provide value for each field" });
      }
    } catch (err) {
      error(`${routes.post.create} ERROR ${err.stack}`);
      next(err);
    }
  },

  async view (req, res, next) {
    try {
      await posts.view(req.query.key);
      const post = await posts.read(req.query.key);
      if (post) {
        res.render("post_view", {
          title: post ? `Raddict | Viewing Post: ${post.key}` : "Raddict | No Such Post",
          postkey: req.query.key,
          post,
          user: req.user ? req.user : undefined
        });
        debug(`Viewing Post ${req.query.key} ${util.inspect(post)}`);
      } else {
        errorHandler.notExist(410);
      }
    } catch (err) {
      error(`${routes.post.view} ERROR ${err.stack}`);
      next(err);
    }
  },

  async like(req, res, next) {
    try {
      const post = await posts.read(req.body.key);
      if (post) {
        const thispost = await posts.like(req.body.key, req.body.likedBy, req.body.likedOnceBy);
        res.status(200).json({ thispost, id: req.body.key });
        debug(`Total Likes: ${util.inspect(thispost.likes)}`);
      } else {
        errorHandler.notExist(410);
      }
    } catch (err) {
      error(`${routes.post.like} ERROR ${err.stack}`);
      next(err);
    }
  },

  async likers(req, res, next) {
    try {
      const keylist = await posts.keylist();
      const keyPromises = await keylist.map( key =>
        posts.read(key).then( post => {
        return { key: post.key, likedBy: post.likedBy };
      }));
      const likelist = await Promise.all(keyPromises);
      res.status(200).json({ likelist });
    } catch (err) {
      error(`${routes.post.likers} ERROR ${err.stack}`);
      next(err);
    }
  },

  async edit (req, res, next) {
    try {
      const post = await posts.read(req.query.key);
      if (post) {
        res.render("post_edit", {
          title: post ? `Raddict | Edit Post: ${post.key}` : "Raddict | Post A Thought",
          docreate: false,
          postkey: req.query.key,
          post,
          user: req.user ? req.user : undefined
        });
      } else {
        errorHandler.notExist(410);
      }
    } catch (err) {
      error(`${routes.post.update} ERROR ${err.stack}`);
      next(err);
    }
  },

  async delete (req, res, next) {
    try {
      let post = await posts.read(req.query.key);
      if (post) {
        res.render("post_delete", {
          title: post ? `Raddict | Delete Post: ${post.key}` : "Raddict: | No Such Post",
          postkey: req.query.key,
          post,
          user: req.user ? req.user : undefined
        });
      } else {
        errorHandler.notExist(410);
      }
    } catch (err) {
      error(`${routes.post.delete} ERROR ${err.stack}`);
      next(err);
    }
  },

  async deleteConfirmed (req, res, next) {
    try {
      await posts.destroy(req.body.postkey);
      res.redirect("/");
    } catch (err) {
      error(`${routes.post.deleteConfirm} ERROR ${err.stack}`)
      next(err);
    }
  },

  async makeComment (req, res, next) {
    const timestamp = new Date();
    try {
      const post = await posts.read(req.body.key);
      if (post) {
        await comments.postComment(req.body.from, req.body.gravatar, req.body.namespace, req.body.comment, timestamp);
        res.status(200).json({ });
      } else {
        errorHandler.notExist();
      }
    } catch (err) {
      error(`${routes.post.comment.make} ERROR ${err.stack}`);
      res.status(500).end(err.stack);
    }
  },

  async likeComment (req, res, next) {
    res.status(200).json({ });
  },

  async deleteComment (req, res, next) {
    try {
      await comments.destroyComment(req.body.id, req.body.namespace);
      debug(`destroyComment function called successfully!`);
      res.status(200).json({ });
    } catch (err) {
      error(`${routes.post.comment.delete} ERROR ${err.stack}`);
      res.status(500).end(err.stack);
    }
  }
};

export function socketio(io) {
  io.of("/view").on("connection", socket => {
    debug(`/Post view connected on ${socket.id}`);
    
    socket.on("getpostcomments", (namespace, cb) => {
      debug(`getpostcomments at ${namespace}`);
      comments.recentComments(namespace).then(cb)
      .catch(err => console.error(err.stack));
    }); // cb is a function sent from the browser to which we sent the list of comments for the named post
  });

  comments.emitter.on("newcomment", newcmt => {
    debug(`newcomment event emitted from server`);
    io.of("/view").emit("newcomment", newcmt);
  });
  comments.emitter.on("destroycomment", data => {
    debug(`destroycomment event emitted from the server`);
    io.of("/view").emit("destroycomment", data);
  });

  posts.events.on("postupdated", post => {
  debug(`"postupdated" event emitted successfully from the server`);
    let data = {};
    data["post"] = {
      key: post.key,
      username: post.username,
      provider: post.provider,
      familyname: post.familyname,
      ugravatar: post.gravatar,
      title: post.title,
      body: post.body,
      likes: post.likes,
      views: post.views,
      likedBy: post.likedBy,
      timestamp: post.timestamp
    }
    debug(`Socketio -- Viewing - Post Data: ${util.inspect(data)}`);
    io.of("/view").emit("postupdated",  data);
  });
  posts.events.on("postdestroyed", data => {
    io.of("/view").emit("postdestroyed", data);
    io.of("/home").emit("postdestroyed", data);
  });
}
