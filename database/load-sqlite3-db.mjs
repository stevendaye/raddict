/* ## Setting up SQLite3 to prepare the database for loading ## */
import util from "util";
import sqlite3 from "sqlite3";
import DBG from "debug";
import config from "../config.mjs";

const debug = DBG("raddict:load-sqlite3");
const error = DBG("raddict:load-error");

var db;

async function connectDB () {
  if (db) {
    debug(`Database Already Created && Opened`);
    return db;
  }

  await new Promise((resolve, reject) => {
    db = new sqlite3.Database(config.db.dbfile,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      err => {
        if (err) {
          reject(err);
        } else {
          debug(`Opened SQLite3 Database: ${config.db.dbfile} -- db = ${util.inspect(db)}`);
          resolve(db);
        }
      }
    );
  });
  return db;
};

export default connectDB;
