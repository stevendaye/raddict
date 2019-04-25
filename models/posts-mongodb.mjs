/* ## Storing Posts in MongoDB Database ## */
import mongodb from "mongodb";
import util from "util";
import DBG from "debug";
import Post from "./Post";

const debug = DBG("raddict:posts-mongodb");
const error = DBG("raddict:error-mongodb");
const MongoClient = mongodb.MongoClient;

var client;

async function connectDB() {
  if (!client) {
    client = await MongoClient.connect(process.env.MONGO_URL); // Connecting to the running mongoDB instance
    debug(`MongoDB Client Created and Connection Opened`);
  }
  return {
    db: client.db(process.env.MONGO_DBNAME),
    client: client
  };
}

// Creating a Post;
async function create(key, title, body) {
  const { client, db } = await connectDB();
  const post = new Post(key, title, body);
  const collection = db.collection("posts"); // Created the posts collection/model/document
  await collection.insertOne({ postkey: key, title, body });
  debug(`Post Created: ${util.inspect(post)}`);
  return post;
}

// Updating a Post
async function update(key, title, body) {
  const { client, db } = await connectDB();
  const post = new Post(key, title, body);
  const collection = db.collection("posts");
  await collection.updateOne({ postkey: key }, { $set: { title, body } });
  debug(`Post Updated: ${util.inspect(post)}`);
  return post;
}

// Reading a Post
async function read(key) {
  const { client, db } = await connectDB();
  const collection = db.collection("posts");
  const doc = await collection.findOne({ postkey: key });
  debug(`Read Post of key: ${doc.postkey}`);
  const post = new Post(doc.postkey, doc.title, doc.body);
  return post;
}

// Deleting a Post
async function destroy(key) {
  const { client, db } = await connectDB();
  const collection = db.collection("posts");
  await collection.findOneAndDelete({ postkey: key });
  debug(`Deleted Post of key: ${key}`);
}

// Returning all Posts
async function keylist() {
  const { client, db } = await connectDB();
  const collection = db.collection("posts");
  let keys = await new Promise((resolve, reject) => {
    let keys = [];
    collection.find({}).forEach(doc => keys.push(doc.postkey), err => {
      if (err) {
        error(`Error occured when retrieving each key in the result set`);
        return reject(err);
      }
      resolve(keys);
    }); // Using the forEach Cursor Object
  });
  return keys;
}

// Counting all Posts
async function count() {
  const { client, db } = await connectDB();
  const collection = db.collection("posts");
  const count = await collection.count({});
  return count;
}

// Closing the database
async function close() {
  client && client.close();
  client = undefined;
}

export { create, update, read, destroy, keylist, count, close };
