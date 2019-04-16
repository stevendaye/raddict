/* ## Creating the Post Object ## */
// Hiding data implementation with Symbol
const _post_key = Symbol("key");
const _post_title = Symbol("title");
const _post_body = Symbol("body");

class Post {
  constructor (key, title, body) {
    this[_post_key] = key;
    this[_post_title] = title;
    this[_post_body] = body;
  }

  get key() { return this[_post_key]; }
  get title() { return this[_post_title] }
  set title(newTitle) { return this[_post_title] = newTitle }
  get body() { return this[_post_body] }
  set body(newBody) { return this[_post_body] = newBody }

  // Adding functions for storing posts in the filesystem
  // Setting a Getter to get the values of the object. This is a JSON representation of the Post object
  get JSON() {
    return JSON.stringify({
      key: this.key,
      title: this.title,
      body: this.body
    });
  }

  // Setting a static file to aid for constructing the JSON object if there is a JSON string
  static fromJSON(json) {
    let data = JSON.parse(json);
    let post = new Post(data.key, data.title, data.body);
    return post;
  }
}

export default Post;
