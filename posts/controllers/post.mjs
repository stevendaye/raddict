/* ## Setting up the post controller ## */
import util from "util";
import DBG from "debug";
import * as posts from "../models/posts-model-type";
import * as comments from "../models/comments-sequelize.mjs";
import config from "../config";

const debug = DBG("raddict:post-controllers");
const error = DBG("raddict:error-controllers");

export default {
  index (req, res, next) {
    try {
      res.render("post_edit", {
        title: "Add a Post",
        docreate: true,
        postkey: "",
        post: undefined,
        user: req.user ? req.user : undefined,
        timestamp: ""
      });
    } catch (err) {
      next(err);
    }
  },

  async create (req, res, next) {
    // This controller is used for both creating and updating posts
    if (req.body.postkey && req.body.title && req.body.body) {
      let post;
      if (req.body.docreate === "create") {
        const timestamp = new Date();
        post = await posts.create(req.body.postkey, req.body.username, req.body.familyname,
          req.body.gravatar, req.body.title, req.body.body, timestamp);
      } else {
        post = await posts.update(req.body.postkey, req.body.username, req.body.familyname,
          req.body.gravatar, req.body.title, req.body.body, req.body.timestamp);
      }
      res.redirect(`${config.routes.post.view}?key=${req.body.postkey}`);
    } else {
      return res.render("post_edit", { message: "You must provide value for each field" });
    }
  },

  async view (req, res, next) {
    try {
      let post = await posts.read(req.query.key);
      res.render("post_view", {
        title: post ? post.title : "",
        postkey: req.query.key,
        post,
        user: req.user ? req.user : undefined
      });
    } catch (err) {
      next(err);
    }
  },

  async edit (req, res, next) {
    try {
      let post = await posts.read(req.query.key)

      res.render("post_edit", {
        title: post ? `Edit Post: ${post.title}` : "Add a Post",
        docreate: false,
        postkey: req.query.key,
        post,
        user: req.user ? req.user : undefined
      });
    } catch (err) {
      next(err);
    }
  },

  async delete (req, res, next) {
    try {
      let post = await posts.read(req.query.key);
      res.render("post_delete", {
        title: post ? post.title : "",
        postkey: req.query.key,
        post,
        user: req.user ? req.user : undefined
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteConfirmed (req, res, next) {
    await posts.destroy(req.body.postkey);
    res.redirect("/");
  },

  async makeComment (req, res, next) {
    const timestamp = new Date();
    try {
      await comments.postComment(req.body.from, req.body.namespace, req.body.comment, timestamp);
      debug(`postComment function called successfully!`);
      res.status(200).json({ });
    } catch (err) {
      error(`Error: Unable to get into the postComment function try block`);
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
      error(`Error: Unable to get into the destroyComment function try block`);
      res.status(500).end(err.stack);
    }
  }
};

export function socketio(io) {
  io.of("/view").on("connection", socket => {
    debug(`/view connected on ${socket.id}`);
    
    socket.on("getpostcomments", (namespace, cb) => {
      debug(`getpostcomments at ${namespace}`);
      comments.recentComments(namespace).then(cb)
      .catch(err => console.error(err.stack));
    }); // cb is a function sent from the browser to which we sent the list of comments for the named post
  });

  comments.emitter.on("newcomment", newcmt => {
    debug(`newcomment event emitted by from server`);
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
      familyname: post.familyname,
      ugravatar: post.gravatar,
      title: post.title,
      body: post.body,
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