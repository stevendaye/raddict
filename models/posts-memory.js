/* ## Storing Posts in Memory ## */
const Post = require("./Post");

var posts = [];

// Creating a Post
exports.create = async (key, title, body) => {
  posts[key] = new Post(key, title, body);
  return posts[key];
};

// Updating a Post
exports.update = async (key, title, body) => {
  posts[key] = new Post(key, title, body);
  return posts[key];
};

// Reading Posts
exports.read = async key => {
  if (posts[key])
    return posts[key];
  else
    throw new Error(`Post ${key} does not exist`);
};

//Deleting Posts
exports.destroy = async key => {
  if (posts[key])
    delete posts[key];
  else
    throw new Error(`Post ${key} does not exist`);
};

exports.keylist = async () => { return Object.keys(posts) };
exports.count = async () => { return posts.length };
exports.close = async () => {};
