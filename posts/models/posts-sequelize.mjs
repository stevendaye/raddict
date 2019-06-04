/* ## Using Sequelize to communicate with Sqlite3 and MySQL Databases ## */
import Sequelize from "sequelize";
import jsyaml from "js-yaml";
import util from "util";
import fs from "fs-extra";
import DBG from "debug";
import Post from "./Post";

const debug = DBG("raddict:post-sequelize");
const error = DBG("raddict:error-sequelize");
const Op = Sequelize.Op;

var SQPost;
var sqlize;

async function connectDB() {
  if (typeof sqlize === "undefined") {
    const YAML = await fs.readFile(process.env.SEQUELIZE_CONNECT, "utf8");
    const params = jsyaml.safeLoad(YAML, "utf8"); // Loading connection parameters from a YAML file

    sqlize = new Sequelize(params.dbname, params.username, params.password, params.params);
  }

  if (SQPost) {
    return SQPost.sync();
  }

  // Defining the Post Schema
  SQPost = sqlize.define("Post", {
    postkey: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true
    },
    username: Sequelize.STRING,
    title: Sequelize.STRING,
    body: Sequelize.TEXT,
    timestamp: Sequelize.DATE
  });
  return SQPost.sync();
}

// Creating a Post
async function create(key, username, title, body, timestamp) {
  const SQPost = await connectDB();
  const post = new Post(key, username, title, body, timestamp);
  await SQPost.create({ postkey: key, username: username, title: title, body: body, timestamp: timestamp });
  debug(`Created the post: ${util.inspect(post)}`);
  return post;
}

// Updating a Post
async function update(key, username, title, body, timestamp) {
  const SQPost = await connectDB();
  const post = await SQPost.find({ where: { postkey: { [Op.eq]: key } } });
  if (!post) {
    throw new Error(`No Post of key = ${key} found.`);
  } else {
    await post.updateAttributes({ title : title, body: body, timestamp: timestamp });
    debug(`Updated Post: ${util.inspect(post)}`);
    return new Post(key, username, title, body, timestamp);
  }
}

// Reading Post
async function read(key) {
  const SQPost = await connectDB();
  const post = await SQPost.find({ where: { postkey: { [Op.eq]: key } } });
  if (!post) {
    throw new Error(`No Post of key = ${key} found.`);
  } else {
    debug(`Read Post of key: ${util.inspect(post)}`);
    return new Post(post.postkey, post.username, post.title, post.body, post.timestamp);
  }
}

// Deleting a Post;
async function destroy(key) {
  const SQPost = await connectDB();
  const post = await SQPost.find({ where: { postkey: { [Op.eq]: key } } });
  debug(`Deleting Post of Key: ${util.inspect(post)}`);
  return post.destroy();
}

// Retrieving All Post
async function keylist() {
  let keys = [];
  const SQPost = await connectDB();
  const posts = SQPost.findAll({ attributes: ["postkey"] });
  await posts.map(post => keys.push(post.postkey));
  debug(`Returning all Posts: ${util.inspect(keys)}`);
  return keys;
}

// Counting all Post
async function count() {
  const SQPost = await connectDB();
  const count = await SQPost.count();
  debug(`Counted All Posts: ${count}`);
  return count;
}

// Closing the database
async function close() {
  sqlize && sqlize.close();
  SQPost = undefined;
  sqlize = undefined;
}

export { create, update, read, destroy, keylist, count, close };
