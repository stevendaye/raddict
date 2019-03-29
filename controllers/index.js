/* ## Setting up the app controllers ## */
module.exports = {
  index (req, res) {
    res.render("index", { title: "Raddict | Your Thoughts Sharing Platform " });
  }
};
