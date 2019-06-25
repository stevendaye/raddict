/* ## Storing Posts in Memory ## */
import Post from "./Post";

var posts = [];

// Creating a Post
export const create = async (key, username, provider, familyname, gravatar, title, body, likes, views, likedBy, timestamp) => {
  posts[key] = new Post(key, username, provider, familyname, gravatar, title, body, likes, views, likedBy, timestamp);
  return posts[key];
};

// Updating a Post
export const update = async (key, username, provider, familyname, gravatar, title, body, likes, views, likedBy, timestamp) => {
  posts[key] = new Post(key, username, provider, familyname, gravatar, title, body, likes, views, likedBy, timestamp);
  return posts[key];
};

// Reading Posts
export const read = async key => {
  if (posts[key])
    return posts[key];
  else
    throw new Error(`Post ${key} does not exist`);
};

//Deleting Posts
export const destroy = async key => {
  if (posts[key])
    delete posts[key];
  else
    throw new Error(`Post ${key} does not exist`);
};

export const keylist = async () => { return Object.keys(posts) };
export const count = async () => { return posts.length };
export const close = async () => {};
