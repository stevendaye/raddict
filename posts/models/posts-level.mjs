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
async function crupdate(key, username, familyname, gravatar, title, body, timestamp) {
  debug(`CRUPDATE:Creating Post -- key: ${key}, username: ${username}, familyname: ${familyname},
  usergravatzar: ${gravatar}, title: ${title}, body: ${body}, timestamp: ${timestamp}`);

  const db = await connectDB();
  let post = new Post(key, username, familyname, gravatar, title, body, timestamp);
  await db.put(key, post.JSON); // Converted to json for easy insertion into the database
  debug(`CRUPDATE:Inserted Post: ${key}, ${username}, ${familyname}, ${gravatar}, ${title}, ${body}, ${timestamp}`);
  return post;
}

async function create(key, username, familyname, gravatar, title, body, timestamp) {
  return crupdate(key, username, familyname, gravatar, title, body, timestamp);
}

async function update(key, username, familyname, gravatar, title, body, timestamp) {
  return crupdate(key, username, familyname, gravatar, title, body, timestamp);
}

// Reading a post from the database
async function read(key) {
  debug(`Reading ${key}`);
  const db = await connectDB();
  let post = Post.fromJSON(await db.get(key));
  return new Post(post.key, post.username, post.familyname, post.gravatar, post.title, post.body, post.timestamp);
};

// Deleting a post from the database
async function destroy(key) {
  debug(`Deleting Post of key: ${key}`);
  const db = await connectDB();
  await db.del(key);
}

// Returning all keys present in the database using the createKeyStream API
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
  debug(`keylist: Returning following keys: ${util.inspect(keys)}`);
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
  debug(`count: Returning counts: ${util.inspect(total)}`);
  return total;
}

async function close() {
  const _db = db;
  db = undefined;
  return _db ? _db.close() : undefined;
}

export { create, update, read, destroy, count, keylist, close };
