/* ## Testing the User Authetication Server by Editing a User ## */
"use strict"

import restify from "restify-clients";
import DBG from "debug";
import util from "util";

const log = DBG("raddict-users:service");
const logError = DBG("raddict-users:error");

var client = restify.createJsonClient({
  url: `http://127.0.0.1:${process.env.PORT}`,
  version: "*"
});

client.basicAuth("team", "DHKHJ98N-UHG9-K09J-7YHD-8Q7LK98DHGS7");

client.post(`/update-user/${process.argv[2]}`, {
  username: "Steph", password: "stephenMylesDsa", provider: "local",
  familyName: "Asha", givenName: "Stephens", middleName: "Josh",
  emails: [], photos: []
}, (err, req, res, obj) => {
  if (err) {
    logError("UPDATE:Oups Something Got Wrong!");
    console.error(err.stack);
  } else {
    console.log(`Updated: ${util.inspect(obj)}`);
  }
});
