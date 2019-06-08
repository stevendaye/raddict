/* ## Creating the Post Object ## */
// Hiding data implementation with Symbol
const _post_key = Symbol("key");
const _post_username = Symbol("username");
const _post_familyname = Symbol("familyname");
const _post_gravatar = Symbol("gravatar");
const _post_title = Symbol("title");
const _post_body = Symbol("body");
const _post_timestamp = Symbol("timestamp");

class Post {
  constructor (key, username, familyname, gravatar, title, body, timestamp) {
    this[_post_key] = key;
    this[_post_username] = username;
    this[_post_familyname] = familyname;
    this[_post_gravatar] = gravatar;
    this[_post_title] = title;
    this[_post_body] = body;
    this[_post_timestamp] = timestamp;
  }

  get key() { return this[_post_key]; }
  get username() { return this[_post_username]; }

  get familyname() { return this[_post_familyname] }

  get gravatar() { return this[_post_gravatar]; }

  get title() { return this[_post_title] }
  set title(newTitle) { return this[_post_title] = newTitle }

  get body() { return this[_post_body] }
  set body(newBody) { return this[_post_body] = newBody }
  
  get timestamp() { return this[_post_timestamp]; }

  // Adding functions for storing posts in the filesystem
  // Setting a Getter to get the values of the object. This is a JSON representation of the Post object
  get JSON() {
    return JSON.stringify({
      key: this.key,
      username: this.username,
      familyname: this.familyname,
      gravatar: this.gravatar,
      title: this.title,
      body: this.body,
      timestamp: this.timestamp
    });
  }

  // Setting a static file to aid for constructing the JSON object if there is a JSON string
  static fromJSON(json) {
    let data = JSON.parse(json);
    let post = new Post(data.key, data.username, data.familyname, data.gravatar, data.title, data.body, data.timestamp);
    return post;
  }
}

export default Post;
