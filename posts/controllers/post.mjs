/* ## Setting up the post controller ## */
import util from "util";
import * as posts from "../models/posts-model-type";
import config from "../config";

export default {
  index (req, res, next) {
    try {
      res.render("post_edit", {
        title: "Add a Post",
        docreate: true,
        postkey: "",
        post: undefined,
        user: req.user ? req.user : undefined
      });
    } catch (err) {
      next(err);
    }
  },

  async create (req, res, next) {
    // This controller is used for both creating and updating posts
    let post;
    if (req.body.docreate === "create") {
      post = await posts.create(req.body.postkey, req.body.title, req.body.body);
    } else {
      post = await posts.update(req.body.postkey, req.body.title, req.body.body);
    }
    res.redirect(`${config.routes.post.view}?key=${req.body.postkey}`);
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
      let post = await posts.read(req.query.key);
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
  }
};
