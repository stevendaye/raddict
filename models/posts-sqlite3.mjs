/* ## Using SQLite3 database engine for storing posts ## */
import util from "util";
import DBG from "debug";
import fs from "fs-extra";
import Post from "./Post";
import connectDB from "../database/load-sqlite3-db";
import config from "../config.mjs";

const debug = DBG("raddict:posts-sqlite3");
const error = DBG("raddict:error-sqlite3");

// Reading from the posts sql table definition file
const readTable = async table => {
  const file = await fs.readFile(table, "utf8");
  debug(`File Read Successfully: ${util.inspect(file)}`);
  return file;
};

var postTable;

// Creating the post Table definition
async function createPostsTable() {
  
  if (postTable) {
    debug(`Posts Table Exists: ${util.inspect(postTable)}`);
    return postTable;
  }
  
  const sqlTable = await readTable(config.db.create_sql_tables.posts);
  let db = await connectDB();

  await new Promise((resolve, reject) => {
    postTable = db.run(`${sqlTable}`,
      err => {
      if (err) {
        error(`Error Occured when creating the table`);
        return reject(err);
      } else {
        debug(`Table Posts Created and Loaded Successfully: ${util.inspect(db)}`);
        resolve(postTable);
      }
    });
  });
  return postTable;
}

// Inserting a post
async function create(key, title, body) {
  await createPostsTable();
  let db = await connectDB();
  let post = new Post(key, title, body);

  await new Promise((resolve, reject) => {
    db.run(`INSERT INTO posts(postkey, title, body)
      VALUES(?, ?, ?)`, [key, title, body],
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
async function update(key, title, body) {
  await createPostsTable();
  let db = await connectDB();
  let post = new Post(key, title, body);

  await new Promise((resolve, reject) => {
    db.run(
      `UPDATE posts
      SET title=?, body =?
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
  await createPostsTable();
  let db = await connectDB();

  let post = await new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM posts WHERE postkey=?`, [key],
      (err, row) => {
        if (err) {
          return reject(err + " Something went wrong when reading!");
        }
        const post = new Post(row.postkey, row.title, row.body);
        debug(`READING ${util.inspect(post)}`);
        resolve(post);
      }
    );
  });
  return post;
}

// Deleting a post
async function destroy(key) {
  await createPostsTable();
  let db = await connectDB();

  return await new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM posts WHERE postkey = ?;", [key],
      err => {
        if (err) {
          return reject(err + " Something went wrong when destroying!");
        }
        debug(`DESTROYED ${key}`);
        resolve();
      }
    );
  });
}

// Returning all pots' keys
async function keylist() {
  await createPostsTable();
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
  await createPostsTable();
  let db = await connectDB();

  let count = new Promise((resolve, reject) => {
    db.get(
      "SELECT Count(postkey) AS count FROM posts",
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
