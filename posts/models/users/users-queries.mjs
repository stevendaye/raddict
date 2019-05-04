/* ## Quries to access the user authentication server ## */
import request from "superagent";
import url from "url";
import util from "util";
import DBG from "debug";
import config from "../../config";

const URL = url.URL;
const debug = DBG(`raddict:users-superagent`);
const error = DBG(`raddict:error-superagent`);

const reqURL = path => {
  const requrl = new URL(process.env.USER_SERVICE_URL);
  requrl.pathname = path;
  return requrl.toString();
}

// Quering the user microservice to create a user record
async function create(username, password, provider, familyName, givenname, middleName, emails, photos) {
  let res = await request
    .post(reqURL(config.routes.user.create))
    .withCredentials()
    .send({ username, password, provider, familyName, givenname, middleName, emails, photos })
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .auth("team", "DHKHJ98N-UHG9-K09J-7YHD-8Q7LK98DHGS7");
  return res.body;
}

// Quering the user microservice to update a user record
async function update(username, password, provider, familyName, givenname, middleName, emails, photos) {
  let res = await request
    .post(reqURL(`${config.routes.user.update}/${username}`))
    .withCredentials()
    .send({ username, password, provider, familyName, givenname, middleName, emails, photos })
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .auth("team", "DHKHJ98N-UHG9-K09J-7YHD-8Q7LK98DHGS7");
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
  return res.body;
}

// Quering the user microservice to find or create a user based on the profile info
async function findOrCreateProfile(profile) {
  let res = await request
    .post(reqURL(config.routes.user.findOrCreate))
    .withCredentials()
    .send({
      username: profile.id,
      password: profile.password,
      provider: profile.provider,
      familyName: profile.familyName,
      givenname: profile.givenname,
      middleName: profile.givenname,
      emails: profile.emails,
      photos: profile.photos
    })
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .auth("team", "DHKHJ98N-UHG9-K09J-7YHD-8Q7LK98DHGS7");
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
}

// Quering the user microservice to list all users in the database
async function listUsers() {
  let res = await request
    .get(reqURL(config.routes.user.list))
    .withCredentials()
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .auth("team", "DHKHJ98N-UHG9-K09J-7YHD-8Q7LK98DHGS7");
  return res.body
}

export { create, update, find, destroy, checkPassword, findOrCreateProfile, listUsers }
