/* ## Testing the User Authetication Server by Creating a User ## */
"use strict";

import restify from "restify-clients";
import DBG from "debug";
import util from "util";
import config from "../config.mjs";

const log = DBG("raddict-users:service");
const logError = DBG("raddict-users:error");

// Creating the Client Object
var client = restify.createJsonClient({
  url: `http://127.0.0.1:${process.env.PORT}`,
  version: "*"
});

// Setting the HTTP basicAuth to be read in req.authorization.basic
client.basicAuth("team", "DHKHJ98N-UHG9-K09J-7YHD-8Q7LK98DHGS7");

client.post(config.routes.user.create, {
  username: "Stephen", password: "stephenMyles", provider: "local",
  familyName: "Myles", givenName: "Stephen", middleName: "Paul",
  gender: "male", birthday: "1987-09-11",
  gravatar: "", displayPicture: "stephen-myles-0127865981693568.jpg",
  profileCreatedAt: "",
  email: ["stephen-myles@yahoo.com"], photos: []
}, (err, req, res, obj) => {
  if (err) {
    logError("CREATE:Oups Something Got Wrong!");
    console.error(err.stack);
  } else {
    console.log(`Created: ${util.inspect(obj)}`);
  }
});
