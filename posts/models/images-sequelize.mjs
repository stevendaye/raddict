/* #### Using Sequelize to Store Posted Images #### */
import Sequelize from "sequelize";
import jsyaml from "js-yaml";
import fs from "fs-extra";
import util from "util";
import DBG from "debug";
import moment from "moment";
import Image from "./Image";
import _events from "./images-events";

const debug = DBG("raddict:image-sequelize");
const error = DBG("raddict:image_error-sequelize");
const Op = Sequelize.Op;

export const events = _events;

var Sqlize;
var SQImage;

async function connectDB() {
  if (typeof sqlize === "undefined") {
    const YAML = await fs.readFile(process.env.SEQUELIZE_CONNECT, "utf8");
    const params = jsyaml.safeLoad(YAML, "utf8");

    Sqlize = new Sequelize(params.dbname, params.username, params.password, params.params);
  }
  
  if (SQImage) {
    return SQImage.sync();
  }

  // Defining the Image Schema
  SQImage = Sqlize.define("Image", {
    imagekey: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true
    },
    filename: Sequelize.STRING,
    username: Sequelize.STRING,
    provider: Sequelize.STRING,
    familyname: Sequelize.STRING,
    gravatar: Sequelize.STRING,
    caption: {
      type: Sequelize.STRING,
      validate: { len: [0, 125] }
    },
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
  return SQImage.sync();
}

// Saving an Image
async function create(key, filename, username, provider, familyname, gravatar, caption, likes, views, likedBy, timestamp) {
  const SQImage = await connectDB();
  const image = new Image(key, filename, username, provider, familyname, gravatar, caption, likes, views, likedBy, timestamp);
  await SQImage.create({imagekey: key, filename: filename, username: username, provider: provider, familyname: familyname,
    gravatar: gravatar, caption: caption, likes: likes, views: views, likedBy: JSON.stringify(likedBy), timestamp: timestamp});
  _events.imageCreated(image);
  debug(`Created the image: ${util.inspect(image)}`);
  return image;
}

// Reading an Image
async function find(key) {
  const SQImage = await connectDB();
  const image = await SQImage.find({ where: { imagekey: { [Op.eq]: key } } });
  if (!image) {
    throw new Error(`No image of key ${key} found`);
  } else {
    debug(`Found Image of key: ${key}`);
    return new Image(image.imagekey, image.filename, image.username, image.provider, image.familyname,
      image.gravatar, image.caption, image.likes, image.views, JSON.parse(image.likedBy), image.timestamp);
  }
}

// Viewing an Image
async function view(key) {
  const SQImage = await connectDB();
  const image = await SQImage.find({ where: { imagekey: { [Op.eq]: key } } });
  await image.updateAttributes({ views: image.views += 1 });
  debug(`Image of ${key} viewed and updated views incrementing it by 1`);
  return image.views += 1;
}

// Liking an Image
async function like(key, likedBy, likedOnceBy) {
  const SQImage = await connectDB();
  const image = await SQImage.find({ where: { imagekey: { [Op.eq]: key } } });
  if (!image) {
    throw new Error(`No Image of key = ${key} found`);
  } else {
    const likedByArray = JSON.parse(image.likedBy);

    if (likedByArray.includes(likedOnceBy.trim())) {
      const oldLikes = likedByArray.filter(likedBy => {
        return likedBy.trim() !== likedOnceBy.trim();
      });
      const likedByList = [ ...oldLikes ];

      await image.updateAttributes({likedBy: JSON.stringify(likedByList), likes: image.likes -=1 });
      const dislikedImage = await SQImage.find({ where: { imagekey: { [Op.eq]: key } } });
      debug(`Image of key ${key} disliked by "${likedOnceBy.trim()}". Updated likes decrementing it by 1.
      LikedByList = ${util.inspect(likedByList)}, LikedByArray = ${util.inspect(dislikedImage.likedBy)}`);

      return { likes: dislikedImage.likes, likedBy: JSON.parse(dislikedImage.likedBy) };
    } else {
      likedByArray[likedBy.trim()] = likedBy.trim();
      const likedByList = [ ...likedByArray, likedByArray[likedBy.trim()] ];
      
      await image.updateAttributes({ likedBy: JSON.stringify(likedByList), likes: image.likes += 1 });
      const likedImage = await SQImage.find({ where: { imagekey: { [Op.eq]: key } } });
      debug(`Image of key ${key} liked by "${likedBy.trim()}". Updated likes incrementing it by 1.
      LikedByList = ${util.inspect(likedByList)}, LikedByArray = ${util.inspect(likedImage.likedBy)}`);

      return { likes: likedImage.likes, likedBy: JSON.parse(likedImage.likedBy)};
    }
  }
}

// Deleting an Image
async function destroy(key) {
  const SQImage = await connectDB();
  const image = await SQImage.find({ where: { imagekey: { [Op.eq]: key } } });
  if (!image) {
    throw new Error(`No image of key ${key} found`);
  } else {
    debug(`Deleting Image of Key: ${util.inspect(image)}`);
    _events.imageDestroyed(key);
    return image.destroy();
  }
}

// Retrieving all posted images
async function keylist() {
  let keys = [];
  const SQImage = await connectDB();
  const images = SQImage.findAll({
    attributes: ["imagekey"], order: [ ["timestamp", "DESC"] ], limit: 25
  });
  await images.map(image => keys.push(image.imagekey));
  debug(`Returning all Images: ${util.inspect(keys)}`);
  return keys;
}

// Counting all posted images;
async function count() {
  const SQImage = await connectDB();
  const count = SQImage.count();
  debug(`Counted All Images: ${count}`);
  return count;
}

// Closing the database conection
async function close() {
  sqlize && sqlize.close();
  SQImage = undefined;
  sqlize = undefined;
}

export { create, find, view, like, destroy, keylist, count, close };
