/* App Configuration */
const config = {
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || "keyboard wolf",
  host: process.env.HOST || "http://localhost:3000",
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
      like: "/posts/like",
      likers: "/posts/likes/all",
      share: "/posts/share",
      comment: {
        make: "/posts/make-comment",
        like: "/posts/like-comment",
        delete: "/posts/delete-comment"
      },
      refresh: "/posts/refresh",
      image: {
        add: "/posts/image/add",
        create: "/posts/image/save",
        view: "/posts/image/view",
        delete: "/posts/image/delete",
        deleteConfirm: "/posts/image/delete/confirm",
        like: "/posts/image/like",
        likers: "/posts/image/likes/all",
        share: "/posts/image/share",
        comment: {
          make: "/posts/image/make-comment",
          like: "/posts/image/like-comment",
          delete: "/posts/image/delete-comment"
        }
      }
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
      signup: "/users/signup",
    },
    auth: {
      twitterAuth: "/users/auth/login/twitter",
      twitterAuthCallback: "/users/auth/login/twitter/callback",
      facebookAuth: "/users/auth/login/facebook",
      facebookAuthCallback: "/users/auth/login/facebook/callback",
      googleAuth: "/users/auth/login/google",
      googleAuthCallback: "/users/auth/login/google/callback"
    }
  },
  db: {
    dbfile: process.env.SQLITE_FILE || "./database/posts.sqlite3",
    create_sql_tables: {
      posts: "./models/schema-sqlite3.sql"
    }
  },
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET
  },
  facebook: {
    appID: process.env.FACEBOOK_APP_ID,
    appSecret: process.env.FACEBOOK_APP_SECRET
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }
};

export default config;
