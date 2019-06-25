/* Handling Errors and 404 Requests */
import util from "util";
import DBG from "debug";

const error = DBG("raddict:error");

const notFound = (req, res, next) => {
  res.status(404).render("404", {
    title: "404! NOT FOUND",
    message: "You May Have Taken A Wrong Turn!"
  });
};

const notExist = (code) => {
  return res.status(code).render("410", {
    title: "410! NO LONGER EXIST",
    message: "What You Are Looking For May Have Been Moved Or Deleted Permanently!"
  });
};

const err = (err, req, res) => {
  util.log(err.message);
  error(`${err.status || 500}${" -- "}${error.message}`);
  res.status(err.status || 500).render("500", { message: err.message, err: {} });
};

export { notFound, notExist, err };
