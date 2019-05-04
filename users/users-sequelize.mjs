/* Creating the User Information Model */
import Sequelize from "sequelize";
import jsyaml from "js-yaml";
import fs from "fs-extra";
import util from "util";
import DBG from "debug";

const debug = DBG("raddict-users:users-sequelize");
const error = DBG("raddict-users:error-sequelize");

var sqlize;
var SQUser;
var Op = Sequelize.Op;

async function connectDB() {
  if (typeof sqlize === "undefined") {
    const YAML = await fs.readFile(process.env.SEQUELIZE_CONNECT, "utf8");
    const params = await jsyaml.safeLoad(YAML, "utf8");

    sqlize = new Sequelize(params.dbname, params.username, params.password, params.params);
  }

  if (SQUser) {
    return SQUser.sync();
  }

  SQUser = sqlize.define("Users", {
    username: {
      type: Sequelize.STRING,
      unique: true
    },
    password: Sequelize.STRING,
    provider: Sequelize.STRING,
    familyName: Sequelize.STRING,
    givenName: Sequelize.STRING,
    middleName: Sequelize.STRING,
    emails: Sequelize.STRING(2048),
    photos: Sequelize.STRING(2048)
  });
  return SQUser.sync();
}

// Creating a new user;
async function create(username, password, provider, familyName, givenName, middleName, emails, photos) {
  const SQUser = await connectDB();
  const user = await SQUser.create({
    username, password,
    provider, familyName, givenName, middleName,
    emails: JSON.stringify(emails),
    photos: JSON.stringify(photos)
  });
  return user;
}

// Updating an existing user
async function update(username, password, provider, familyName, givenName, middleName, emails, photos) {
  const SQUser = await connectDB();
  const user = await SQUser.find({ where: { username: { [Op.eq]: username } } });
  return user
    ? await user.updateAttributes({
        password, provider,
        familyName, givenName, middleName,
        emails: JSON.stringify(emails),
        photos: JSON.stringify(photos)
      })
    : undefined;
}

// Reading a user and sanitized them upon finding
async function find(username) {
  const SQUser = await connectDB();
  const user = await SQUser.find({ where: { username: { [Op.eq]: username } } });
  debug(`Find User: ${util.inspect(sanitizedUser(user))}`);
  return user
    ? sanitizedUser(user)
    : undefined;
} // Returning a sanitized user object instead of the actual user object so as not to expose data we don't want exposed

// Deleting a user
async function destroy(username) {
  const SQUser = await connectDB();
  const user = await SQUser.find({ where: { username: { [Op.eq]: username } } });
  if (!user) {
    throw new Error(`No username ${username} found`);
  }
  user.destroy();
}

// Checking the user's password
async function userCheckPassword(username, password) {
  const SQUser = await connectDB();
  const user = await SQUser.find({ where: { username: { [Op.eq]: username } } });
  if (!user) {
    return {
      check: false,
      username: username,
      message: "No Such User Found!"
    };
  } else if (user.username === username && user.password === password) {
    return {
      check: true,
      username: username
    };
  } else {
    return {
      check: false,
      username: username,
      message: "Incorrect Password!"
    }
  }
}

// Creating or finding a user profile. This will be used to authenticate against third-party modules
async function findOrCreateProfile(profile) {
  const user = await find(profile.id);
  if (user) {
    return user
  }
  // If no user profile exists, then we create one
  return await create(
    profile.id, profile.password, profile.provider,
    profile.familyName, profile.givenName,profile.middleName,
    profile.emails, profile.photos
  );
}

// Listing all existing users
async function listUsers() {
  const SQUser = await connectDB();
  const users = await SQUser.findAll({});
  return users.map(user => sanitizedUser(user));
}

// Sanitizing users to emulate a secured user information service exposing only what we want exposed
async function sanitizedUser(user) {
  let ret = {
    id: user.username,
    username: user.username,
    provider: user.provider,
    familyName: user.familyName,
    givenName: user.givenName,
    middleName: user.middleName,
    emails: JSON.parse(user.emails),
    photos: JSON.parse(user.photos)
  };
  
  // Catching errors in case the parsing was unsuccessfull
  try {
    ret.emails = JSON.parse(user.emails);
  } catch (err) {
    ret.emails = [];
  }

  try {
    ret.photos = JSON.parse(user.photos);
  } catch (err) {
    ret.photos = [];
  }
  return ret;
}

export { create, update, find, destroy, userCheckPassword, findOrCreateProfile, listUsers, sanitizedUser };
