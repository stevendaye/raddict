/* ## Configuration file for each Restify route ## */
const config = {
  routes: {
    user: {
      create: "/create-user",
      update: "/update-user/:username",
      findOrCreate: "/find-or-create",
      find: "/find-user/:username",
      destroy: "/destroy-user/:username",
      checkPassword: "/password-check",
      list: "/list-users"
    }
  }
};

export default config;
