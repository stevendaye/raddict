/* ## Creating the Image Object ## */
const _image_key = Symbol("key");
const _image_filename = Symbol("filename");
const _image_username = Symbol("username");
const _image_provider =  Symbol("provider");
const _image_familyname = Symbol("familyname");
const _image_gravatar = Symbol("gravatar");
const _image_caption = Symbol("caption");
const _image_likes = Symbol("likes");
const _image_views = Symbol("views");
const _image_likedBy = Symbol("likedBy");
const _image_timestamp = Symbol("timestamp");

class Image {
  constructor(key, filename, username, provider, familyname, gravatar, caption, likes, views, likedBy, timestamp) {
    this[_image_key] = key;
    this[_image_filename] = filename;
    this[_image_username] = username;
    this[_image_provider] = provider;
    this[_image_familyname] = familyname;
    this[_image_gravatar] = gravatar;
    this[_image_caption] = caption;
    this[_image_likes] = likes;
    this[_image_views] = views;
    this[_image_likedBy] = likedBy;
    this[_image_timestamp] = timestamp;
  }

  get key() { return this[_image_key]; }
  get filename() { return this[_image_filename]; }
  get username() { return this[_image_username]; }
  get provider() { return this [_image_provider]; }
  get familyname() { return this[_image_familyname]; }
  get gravatar() { return this[_image_gravatar]; }
  get caption() { return this[_image_caption]; }

  get likes() { return this[_image_likes]; }
  set likes(newLikes) { return this[_image_likes] = newLikes; }

  get views() { return this[_image_views]; }
  set views(newViews) { return this[_image_views] = newViews; }

  get likedBy() { return this[_image_likedBy]; }
  get timestamp() { return this[_image_timestamp]; }

  // Adding functions for storing images data in the filesystem in case
  get JSON() {
    return JSON.stringify({
      key: this.key,
      filename: this.filename,
      username: this.username,
      provider: this.provider,
      familyname: this.familyname,
      gravatar: this.gravatar,
      caption: this.caption,
      likes: this.likes,
      views: this.views,
      likedBy: this.likedBy,
      timestamp: this.timestamp
    });
  }

  static fromJSON(json) {
    let data = JSON.parse(json);
    let image = new Image(data.key, data.filename, data.username, data.provider, data.familyname, data.gravatar,
      data.caption, data.likes, data.views, data.likedBy, data.timestamp);
    return image;
  }
}

export default Image;
