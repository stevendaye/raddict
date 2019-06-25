/* ## Creating the Post Object ## */
// Hiding data implementation with Symbol
const _post_key = Symbol("key");
const _post_username = Symbol("username");
const _post_provider = Symbol("provider");
const _post_familyname = Symbol("familyname");
const _post_gravatar = Symbol("gravatar");
const _post_title = Symbol("title");
const _post_body = Symbol("body");
const _post_likes = Symbol("likes");
const _post_views = Symbol("views");
const _post_likedBy = Symbol("likedBy");
const _post_timestamp = Symbol("timestamp");

class Post {
  constructor (key, username, provider, familyname, gravatar, title, body, likes, views, likedBy, timestamp) {
    this[_post_key] = key;
    this[_post_username] = username;
    this[_post_provider] = provider;
    this[_post_familyname] = familyname;
    this[_post_gravatar] = gravatar;
    this[_post_title] = title;
    this[_post_body] = body;
    this[_post_likes] = likes;
    this[_post_views] = views;
    this[_post_likedBy] = likedBy;
    this[_post_timestamp] = timestamp;
  }

  get key() { return this[_post_key]; }
  get username() { return this[_post_username]; }

  get provider() { return this[_post_provider]; }

  get familyname() { return this[_post_familyname] }

  get gravatar() { return this[_post_gravatar]; }

  get title() { return this[_post_title] }
  set title(newTitle) { return this[_post_title] = newTitle }

  get body() { return this[_post_body] }
  set body(newBody) { return this[_post_body] = newBody }

  get likes() { return this[_post_likes] }
  set likes(newLikes) { return this[_post_likes] = newLikes }

  get views() { return this[_post_views] }
  set views(newViews) { return this[_post_views] = newViews}

  get likedBy() { return this[_post_likedBy]; }
  get timestamp() { return this[_post_timestamp]; }

  // Adding functions for storing posts in the filesystem
  // Setting a Getter to get the values of the object. This is a JSON representation of the Post object
  get JSON() {
    return JSON.stringify({
      key: this.key,
      username: this.username,
      provider: this.provider,
      familyname: this.familyname,
      gravatar: this.gravatar,
      title: this.title,
      body: this.body,
      likes: this.likes,
      views: this.views,
      likedBy: this.likedBy,
      timestamp: this.timestamp
    });
  }

  // Setting a static file to aid for constructing the JSON object if there is a JSON string
  static fromJSON(json) {
    let data = JSON.parse(json);
    let post = new Post(data.key, data.username, data.provider, data.familyname, data.gravatar, data.title,
      data.body, data.likes, data.views, data.likedBy, data.timestamp);
    return post;
  }
}

export default Post;
