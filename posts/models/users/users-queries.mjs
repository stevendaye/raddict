/* The code to query to "users" microservice is one that I am especially proud of.
 * I took days for researching possible ways of implementing this through RESTFull API's,
 * all the while, making sure that access to the "users" sever is restricted and secured.
*/
/* ## Quries to access the user authentication server ## */
import request from "superagent";
import url from "url";
import util from "util";
import DBG from "debug";
import config from "../../config";

const URL = url.URL;
const log = DBG(`raddict:users-superagent`);
const error = DBG(`raddict:error-superagent`);

const reqURL = path => {
  const requrl = new URL(process.env.USER_SERVICE_URL);
  requrl.pathname = path;
  return requrl.toString();
}

// Quering the user microservice to create a user record
async function create(username, password, provider, familyName, givenName, middleName,
    gender, birthday, gravatar, displayPicture, profileCreatedAt, emails, photos) {
  let res = await request
    .post(reqURL(config.routes.user.create))
    .withCredentials()
    .send({ username, password, provider, familyName, givenName, middleName,
      gender, birthday, gravatar, displayPicture, profileCreatedAt, emails, photos })
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .auth("team", "DHKHJ98N-UHG9-K09J-7YHD-8Q7LK98DHGS7");
    log(`create: {
      username: ${username}, provider: ${provider},
      familyName: ${familyName}, givenName: ${givenName}, middleName: ${middleName}
      emails: ${emails}, photos: ${photos}
    }`);
  return res.body;
}

// Quering the user microservice to update a user record
async function update(username, password, provider, familyName, givenName, middleName,
  gender, birthday, gravatar, displayPicture, profileCreatedAt, emails, photos) {
  let res = await request
    .post(reqURL(`${config.routes.user.update}/${username}`))
    .withCredentials()
    .send({ username, password, provider, familyName, givenName, middleName,
      gender, birthday, gravatar, displayPicture, profileCreatedAt, emails, photos })
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .auth("team", "DHKHJ98N-UHG9-K09J-7YHD-8Q7LK98DHGS7");
    log(`update:${util.inspect(res.body)}`);
  return res.body;
}

// Quering the user microservice to read a user record
async function find(username) {
  let res = await request
    .get(reqURL(`${config.routes.user.find}/${username}`))
    .withCredentials()
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .auth("team", "DHKHJ98N-UHG9-K09J-7YHD-8Q7LK98DHGS7");
    log(`find:${util.inspect(res.body)}`);
  return res.body;
}

// Quering the user microservice to check the user's password
async function checkPassword(username, password) {
  let res = await request
    .post(reqURL(config.routes.user.checkPassword))
    .withCredentials()
    .send({ username, password })
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .auth("team", "DHKHJ98N-UHG9-K09J-7YHD-8Q7LK98DHGS7");
    log(`checkPassword:${util.inspect(res.body)}`);
  return res.body;
}

// Quering the user microservice to find or create a user based on the profile info
async function findOrCreate(profile) {
  let res = await request
    .post(reqURL(config.routes.user.findOrCreate))
    .withCredentials()
    .send({
      username: profile.id,
      password: profile.password,
      provider: profile.provider,
      familyName: profile.familyName,
      givenName: profile.givenName,
      middleName: profile.middleName,
      gender: profile.gender,
      birthday: profile.birthday,
      gravatar: profile.gravatar,
      displayPicture: profile.displayPicture,
      profileCreatedAt: profile.profileCreatedAt,
      emails: profile.emails,
      photos: profile.photos
    })
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .auth("team", "DHKHJ98N-UHG9-K09J-7YHD-8Q7LK98DHGS7");
    log(`findOrCreate:${util.inspect(res.body)}`);
  return res.body;
}

// Quering the user microservice to delete a user
async function destroy(username) {
  await request
    .del(reqURL(`${config.routes.user.delete}/${username}`))
    .withCredentials()
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .auth("team", "DHKHJ98N-UHG9-K09J-7YHD-8Q7LK98DHGS7");
    log(`destroy:${username}`);
}

// Quering the user microservice to list all users in the database
async function listUsers() {
  let res = await request
    .get(reqURL(config.routes.user.list))
    .withCredentials()
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .auth("team", "DHKHJ98N-UHG9-K09J-7YHD-8Q7LK98DHGS7");
    log(`listUsers:${util.inspect(res.body)}`);
  return res.body
}

export { create, update, find, destroy, checkPassword, findOrCreate, listUsers }
