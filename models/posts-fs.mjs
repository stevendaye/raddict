/* ## Storing posts in the filesystem ## */
import util from "util";
import fs from "fs-extra";
import path from "path";
import DGB from "debug";
import Post from "./Post";

const debug = DGB("raddict:posts-fs");
const error = DGB("raddict:error-fs");

// Creating a directory for storing posts
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
  debug(`readJSON ${data}`);
  return Post.fromJSON(data);
};

// Creating and updating a post
const crupdate = async (key, title, body) => {
  const postsdir = await postsDir();
  if (key.includes("/"))
    throw new Error(`${key} cannot contain '/'`);
  let post = new Post(key, title, body);
  let writeTo = filePath(postsdir, key);
  let writeJSON = post.JSON;
  debug(`WRITE ${writeTo} - ${writeJSON}`);
  await fs.writeFile(writeTo, writeJSON, "utf8");
  return post;
};

export const create = (key, title, body) =>
  crupdate(key, title, body);

export const update = (key, title, body) =>
  crupdate(key, title, body);

// Reading a post from the 'key.json' file
export const read = async key => {
  const postsdir = await postsDir();
  let userpost = readJSON(postsdir, key);
  debug(`READ ${postsdir}/${key} - ${util.inspect(userpost)}`);
  return userpost;
}

// Deleting a post from the filesystem(deletes a 'key.json' file)
export const destroy = async key => {
  const postsdir = await postsDir();
  await fs.unlink(filePath(postsdir, key));
}

// Returning list of posts keys from the filesystem
export const keylist = async () => {
  let postsdir = await postsDir();
  let files = await fs.readdir(postsdir);
  let emptyDir = [];
  (!files || typeof files === "undefined") && emptyDir;
  debug(`keylist dir ${postsdir} files=${util.inspect(files)}`);
  let usersposts = files.map(async filename => {
    let key = path.basename(filename, ".json");
    debug(`About to READ ${key}`);
    let userpost = await readJSON(postsdir, key);
    return userpost.key;
  });
  return Promise.all(usersposts); // Making sure that all keys have been returned
};

// Counting all posts
export const count = async () => {
  let postsdir = await postsDir();
  let files = fs.readdir(postsdir);
  return files.length;
};

export const close = () => {};
