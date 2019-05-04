/* App Configuration */
const config = {
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || "keyboard wolf",
  postsHost: process.env.POSTS_HOST || "http://localhost:3000",
  usersHost: process.env.USERS_HOST || "http://localhost:3333",
  routes: {
    post: {
      add: "/posts/add",
      create: "/posts/save",
      view: "/posts/view",
      update: "/posts/edit",
      delete: "/posts/delete",
      deleteConfirm: "/posts/delete/confirm",
    },
    user: {
      create: "/create-user",
      update: "/update-user",
      find: "/find-user",
      delete: "/destroy-user",
      checkPassword: "/password-check",
      findOrCreate: "/find-or-create",
      list: "/list-users",
      login: "/users/login",
      logout: "/users/logout",
      signup: "/users/signup"
    }
  },
  db: {
    dbfile: process.env.SQLITE_FILE || "./database/posts.sqlite3",
    create_sql_tables: {
      posts: "./models/schema-sqlite3.sql"
    }
  }
};

export default config;
