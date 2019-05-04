/* ## Testing the User Authetication Server by Deleting a User ## */
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

client.del(`/destroy-user/${process.argv[2]}`, (err, req, res, obj) => {
  if (err) {
    logError("DELETE:Oups Somthing Got Wrong!");
    console.error(err.stack);
  } else {
    console.log(`Deleted: ${process.argv[3]}`);
  }
});
