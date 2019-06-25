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
var Sqlize;

async function connectDB() {
  if (typeof sqlize === "undefined") {
    const YAML = await fs.readFile(process.env.SEQUELIZE_CONNECT, "utf8");
    const params = jsyaml.safeLoad(YAML, "utf8"); // Loading connection parameters from a YAML file

    Sqlize = new Sequelize(params.dbname, params.username, params.password, params.params);
  }

  if (SQPost) {
    return SQPost.sync();
  }

  // Defining the Post Schema
  SQPost = Sqlize.define("Post", {
    postkey: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true
    },
    username: Sequelize.STRING,
    provider: Sequelize.STRING,
    familyname: Sequelize.STRING,
    gravatar: Sequelize.STRING,
    title: Sequelize.STRING,
    body: Sequelize.TEXT,
    likes: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    views: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    likedBy: Sequelize.STRING,
    timestamp: Sequelize.DATE
  });
  return SQPost.sync();
}

// Creating a Post
async function create(key, username, provider, familyname, gravatar, title, body, likes, views, likedBy, timestamp) {
  const SQPost = await connectDB();
  const post = new Post(key, username, provider, familyname, gravatar, title, body, likes, views, likedBy, timestamp);
  await SQPost.create({ postkey: key, username: username, provider: provider, familyname: familyname, gravatar: gravatar,
  title: title, body: body, likes: likes, views: views, likedBy: JSON.stringify(likedBy), timestamp: timestamp });
  debug(`Created the post: ${util.inspect(post)}`);
  return post;
}

// Updating a Post
async function update(key, username, provider, familyname, gravatar, title, body, likes, views, likedBy, timestamp) {
  const SQPost = await connectDB();
  const post = await SQPost.find({ where: { postkey: { [Op.eq]: key } } });
  if (!post) {
    throw new Error(`update -- No Post of key = ${key} found.`);
  } else {
    await post.updateAttributes({ title : title, body: body });
    debug(`Updated Post: ${util.inspect(post)}`);
    return new Post(key, username, provider, familyname, gravatar, title, body, likes, views, likedBy, timestamp);
  }
}

// Reading Post
async function read(key) {
  const SQPost = await connectDB();
  const post = await SQPost.find({ where: { postkey: { [Op.eq]: key } } });
  if (!post) {
    throw new Error(`read -- No Post of key = ${key} found.`);
  } else {
    debug(`Read Post of key: ${util.inspect(post)}`);
    return new Post(post.postkey, post.username, post.provider, post.familyname, post.gravatar, post.title,
      post.body, post.likes, post.views, JSON.parse(post.likedBy), post.timestamp);
  }
}

// Liking a Post
async function like(key, likedBy, likedOnceBy) {
  const SQPost = await connectDB();
  const post = await SQPost.find({ where: { postkey: { [Op.eq]: key } } });
  if (!post) {
    throw new Error(`No Post of key = ${key} found`);
  } else {
    const likedByArray = JSON.parse(post.likedBy);

    if (likedByArray.includes(likedOnceBy.trim())) {
      const oldLikes = likedByArray.filter(likedBy => {
        return likedBy.trim() !== likedOnceBy.trim();
      });
      const likedByList = [ ...oldLikes ];

      await post.updateAttributes({likedBy: JSON.stringify(likedByList), likes: post.likes -=1 });
      const dislikedPost = await SQPost.find({ where: { postkey: { [Op.eq]: key } } });
      debug(`Post of key ${key} disliked by "${likedOnceBy.trim()}". Updated likes decrementing it by 1.
      LikedByList = ${util.inspect(likedByList)}, LikedByArray = ${util.inspect(dislikedPost.likedBy)}`);

      return { likes: dislikedPost.likes, likedBy: JSON.parse(dislikedPost.likedBy) };
    } else {
      likedByArray[likedBy.trim()] = likedBy.trim();
      const likedByList = [ ...likedByArray, likedByArray[likedBy.trim()] ];
      
      await post.updateAttributes({ likedBy: JSON.stringify(likedByList), likes: post.likes += 1 });
      const likedPost = await SQPost.find({ where: { postkey: { [Op.eq]: key } } });
      debug(`Post of key ${key} liked by "${likedBy.trim()}". Updated likes incrementing it by 1.
      LikedByList = ${util.inspect(likedByList)}, LikedByArray = ${util.inspect(likedPost.likedBy)}`);

      return { likes: likedPost.likes, likedBy: JSON.parse(likedPost.likedBy)};
    }
  }
}

// Viewing a Post
async function view(key) {
  const SQPost = await connectDB();
  const post = await SQPost.find({ where: { postkey: { [Op.eq]: key } } });
  if (!post) {
    throw new Error(`view -- No Post of key = ${key} found`);
  } else {
    await post.updateAttributes({ views: post.views += 1 });
    debug(`Post of ${key} viewed and updated views incrementing it by 1`);
    return post.views += 1;
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
  const posts = SQPost.findAll({
    attributes: ["postkey"], order: [ ["timestamp", "DESC"] ], limit: 25
  });
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

export { create, update, read, like, view, destroy, keylist, count, close };
