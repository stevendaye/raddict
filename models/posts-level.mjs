/*## Using The Level Database Engine ##*/
import util from "util";
import fs from "fs-extra";
import path from "path";
import level from "level";
import DBG from "debug";
import Post from "./Post";

const debug = DBG("raddict:post-level");
const error = DBG("raddict:error-level");

var db;

async function connectDB() {
  if (typeof db !== "undefined" || db) {
    return db;
  }

  db = await level(
    process.env.LEVELDB_LOCATION || "posts.level", {
      createIfMissing: true,
      valueEncoding: "json"
    }
  );
  return db;
}

// Creating a new database entry for inserting a post
async function crupdate(key, title, body) {
  const db = await connectDB();
  let post = new Post(key, title, body);
  await db.put(key, post.JSON); // Converted to json for easy insertion into the database
  return post;
}

async function create(key, title, body) {
  return crupdate(key, title, body);
}

async function update(key, title, body) {
  return crupdate(key, title, body);
}

// Reading a post from the database
async function read(key) {
  const db = await connectDB();
  let post = Post.fromJSON(await db.get(key));
  return new Post(post.key, post.title, post.body);
};

// Deleting a post from the database
async function destroy(key) {
  const db = await connectDB();
  await db.del(key);
}

// Retuning all keys present in the database using the createKeyStream API
// This API emits event as it goeas through each data in the database
async function keylist() {
  const db = await connectDB();
  let keys = [];
  await new Promise((resolve, reject) => {
    db.createKeyStream()
    .on("data", data => keys.push(data))
    .on("error", err => reject(err))
    .on("end", () => resolve(keys));
  });
  return keys;
}

// Counting all posts in the database
async function count() {
  const db = await connectDB();
  let total = 0;
  await new Promise((resolve, reject) => {
    db.createKeyStream()
      .on("data", data => total++)
      .on("error", err => reject(err))
      .on("end", () => resolve(total));
  });
  return total;
}

async function close() {
  const _db = db;
  db = undefined;
  return _db ? _db.close() : undefined;
}

export { create, update, read, destroy, count, keylist, close };
