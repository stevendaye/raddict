/* ## Setting up the home controller ## */
import * as posts from "../models/posts-model-type";

export default {
  async index (req, res, next) {
    try {
      let keylist = await posts.keylist();
      let keyPromises = keylist.map( key =>
        posts.read(key)
      );
      let postlist = await Promise.all(keyPromises);

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
