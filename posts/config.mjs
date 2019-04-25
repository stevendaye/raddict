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
    user: {
      create: "/users/create"
    }
  },
  db: {
    dbfile: process.env.SQLITE_FILE || "./database/posts.sqlite3",
    create_sql_tables: {
      posts: "./models/schema-sqlite3.sql"
    }
  },
  secret: process.env.SECRET || "secret"
};

export default config;
