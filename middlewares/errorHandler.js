/* Handling Errors and 404 Requests */
exports.notFound = (req, res, next) => {
  res.status(404).render("404", { title: "404! NOT FOUND", message: "Oops! You May Have Taken A Wrong Turn!" });
};

exports.err = (err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env");
  res.status(err.status || 500).render("500");
}