/* ## Using SQLite3 database engine for storing posts ## */
import util from "util";
import DBG from "debug";
import Post from "./Post";
import connectDB from "../database/load-sqlite3-db";

const debug = DBG("raddict:posts-sqlite3");
const error = DBG("raddict:error-sqlite3");

// Inserting a post
async function create(key, username, familyname, gravatar, title, body, timestamp) {
  let db = await connectDB();
  let post = new Post(key, username, familyname, gravatar, title, body, timestamp);

  await new Promise((resolve, reject) => {
    db.run(`INSERT INTO posts(postkey, username, familyname, gravatar, title, body, timestamp)
      VALUES(?, ?, ?, ?, ?, ?, ?)`, [key, username, familyname, gravatar, title, body, timestamp],
      err => {
        if (err) {
          return reject(err + " Something went wrong when inserting!");
        }
        debug(`CREATED ${util.inspect(post)}`);
        resolve(post);
      }
    );
  });
  return post;
}

// Updating a post
async function update(key, username, familyname, gravatar, title, body, timestamp) {
  let db = await connectDB();
  let post = new Post(key, username, familyname, gravatar, title, body, timestamp);

  await new Promise((resolve, reject) => {
    db.run(
      `UPDATE posts
      SET title =?, body =?
      WHERE postkey =?`, [title, body, key],
      err => {
        if (err) {
          return reject(err + " Something went wrong when updating");
        }
        debug(`UPDATED ${util.inspect(post)}`);
        resolve(post);
      }
    );
  });
  return post;
}

// Reading a post
async function read(key) {
  let db = await connectDB();

  let post = await new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM posts WHERE postkey=?`, [key],
      (err, row) => {
        if (err) {
          return reject(err + " Something went wrong when reading!");
        }
        const post = new Post(row.postkey, row.username, row.familyname, row.gravatar , row.title, row.body, row.timestamp);
        debug(`READING ${util.inspect(post)}`);
        resolve(post);
      }
    );
  });
  return post;
}

// Deleting a post
async function destroy(key) {
  let db = await connectDB();

  return await new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM posts WHERE postkey = ?;", [key],
      err => {
        if (err) {
          return reject(err + " Something went wrong when destroying!");
        }
        debug(`DELETED ${key}`);
        resolve();
      }
    );
  });
}

// Returning all pots' keys
async function keylist() {
  let db = await connectDB();
  debug(`keylist: ${util.inspect(db)}`);

  let keys = new Promise((resolve, reject) => {
    let keys = [];
    db.all(
      "SELECT postkey FROM posts",
      (err, rows) => {
        if (err) {
          return reject(err + " Something went wrong when collecting all keys!");
        }
        rows.map(row => keys.push(row.postkey));
        resolve(keys);
      }
    );
  });
  debug(`KEYS: Listing keys: ${util.inspect(keys)}`);
  return keys;
}

// Counting all posts
async function count() {
  let db = await connectDB();

  let count = new Promise((resolve, reject) => {
    db.get(
      "SELECT COUNT(postkey) AS Count FROM posts",
      (err, row) => {
        if (err) {
          return reject(err  + " Something went wrong when inserting!");
        }
        debug(`COUNTED all keys: ${util.inspect(row)}`);
        resolve(row.count)
      }
    );
  });
  return count;
}

// Closing the database
async function close() {
  let _db = db;
  db = undefined;
  _db
    ? new Promise((resolve, reject) => {
      _db.close(err => {
        if (err) {
          reject(err + " Something went wrong when closing database");
        } else {
          resolve();
        }
      });
    })
    : undefined
}

export { create, update, read, destroy, keylist, count, close };
