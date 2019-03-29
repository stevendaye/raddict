/* ## Setting up the home controller ## */
const posts = require("../models/posts-memory");

module.exports = {
  async index (req, res) {
    let keylist = await posts.keylist();
    let keyPromises = keylist.map( key =>
      posts.read(key)
    );
    let postlist = await Promise.all(keyPromises);

    res.render("index", { title: "Raddict | Your Thoughts Sharing Platform ", content: "Posts", postlist });
  }
};
