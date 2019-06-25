/* ## Storing posts in the filesystem ## */
import util from "util";
import fs from "fs-extra";
import path from "path";
import DGB from "debug";
import Post from "./Post";

const debug = DGB("raddict:posts-fs");
const error = DGB("raddict:error-fs");

// Creating a directory for storing files containing a user's post
const postsDir = async () => {
  let dir = process.env.POSTS_FS_DIR || "posts-fs-dir";
  await fs.ensureDir(dir);
  return dir;
};

// Creating a .json file per post. The 'key' is added to create a unique file
const filePath = (postsdir, key) =>
  path.join(postsdir, `${key}.json`);

// Reading the post from the .json file and Storing it as a JSON object;
const readJSON = async (postsdir, key) => {
  const readFrom = filePath(postsdir, key);
  let data = await fs.readFile(readFrom, "utf8");
  debug(`readJSON:Reading Data From a JSON file -- ${data}`);
  return Post.fromJSON(data);
};

// Creating and updating a post
const crupdate = async (key, username, provider, familyname, gravatar, title, body, likes, views, likedBy, timestamp) => {
  const postsdir = await postsDir();
  if (key.includes("/"))
    throw new Error(`${key} cannot contain '/'`);
  let post = new Post(key, username, provider, familyname, gravatar, title, body, likes, views, likedBy, timestamp);
  let writeTo = filePath(postsdir, key);
  let writeJSON = post.JSON;
  debug(`WRITING: ${writeJSON} TO: ${writeTo}`);
  await fs.writeFile(writeTo, writeJSON, "utf8");
  return post;
};

export const create = (key, username, provider, familyname, gravatar, title, body, likes, views, likedBy, timestamp) =>
  crupdate(key, username, provider, familyname, gravatar, title, body, likes, views, likedBy, timestamp);

export const update = (key, username, provider, familyname, gravatar, title, body, likes, views, likedBy, timestamp) =>
  crupdate(key, username, provider, familyname, gravatar, title, body, likes, views, likedBy, timestamp);

// Reading a post from the 'key.json' file
export const read = async key => {
  const postsdir = await postsDir();
  let userpost = readJSON(postsdir, key);
  debug(`READ:Read Data From a JSON File -- ${postsdir}/${key} - ${util.inspect(userpost)}`);
  return userpost;
}

// Deleting a post from the filesystem(deletes a 'key.json' file)
export const destroy = async key => {
  const postsdir = await postsDir();
  debug(`Deleting ${key}`);
  await fs.unlink(filePath(postsdir, key));
}

// Returning list of posts keys from the filesystem
export const keylist = async () => {
  let postsdir = await postsDir();
  let files = await fs.readdir(postsdir);
  let emptyDir = [];
  (!files || typeof files === "undefined") && emptyDir;
  debug(`keylist:Listing Files Within "${postsdir}" Directory. Files:${util.inspect(files)}`);
  let usersposts = files.map(async filename => {
    let key = path.basename(filename, ".json");
    debug(`READ:Reading ${key}`);
    let userpost = await readJSON(postsdir, key);
    return userpost.key;
  });
  return Promise.all(usersposts); // Making sure that all keys have been read and returned
};

// Counting all posts
export const count = async () => {
  let postsdir = await postsDir();
  let files = fs.readdir(postsdir);
  debug(`Counting All Posts`);
  return files.length;
};

export const close = () => {};
