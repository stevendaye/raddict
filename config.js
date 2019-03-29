/* App Configuration */
const config = {
  port: process.env.PORT || 3000,
  routes: {
    post: {
      add: "/posts/add",
      create: "/posts/save",
      view: "/posts/view",
      update: "/posts/edit",
      delete: "/posts/delete",
      deleteConfirm: "/posts/delete/confirm",
    },
    user: {}
  },
  secret: process.env.SECRET || "secret"
};

module.exports = config;
