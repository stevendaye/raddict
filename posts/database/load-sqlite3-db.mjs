/* ## Setting and opening the SQLite3 database ## */
import sqlite3 from "sqlite3";
import util from "util";
import fs from "fs-extra";
import DBG from "debug";
import config from "../config.mjs";

const debug = DBG("raddict:load-sqlite3");
const error = DBG("raddict:load-error");

var db;

// Reading from the posts sql table definition file
const readTable = async table => {
  const file = await fs.readFile(table, "utf8");
  debug(`File Read Successfully: ${util.inspect(file)}`);
  return file;
};

// Creating the database and posts table definition
async function connectDB () {
  if (db) {
    debug(`Database Already Created && Opened`);
    return db;
  }

  const postsTable = await readTable(config.db.create_sql_tables.posts);

  await new Promise((resolve, reject) => {
    db = new sqlite3.Database(config.db.dbfile,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      err => {
        if (err) {
          return reject(err + "Error occured when opening the database");
        } else {
          debug(`Opened SQLite3 Database: ${config.db.dbfile} -- db = ${util.inspect(db)}`);
          resolve(db);
        }
      }
    );
  });

  await new Promise((resolve, reject) => {
    db.run(`${postsTable}`,
      err => {
      if (err) {
        error(`Error Occured when creating the table`);
        return reject(err);
      } else {
        debug(`Table Posts Created and Loaded Successfully: ${util.inspect(db)}`);
        resolve();
      }
    });
  });

  return db;
};

export default connectDB;
