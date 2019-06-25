/* ## Dynamically Selecting a Data Model for Raddict ## */
import _events from "./posts-events";

let PostModelType;

async function model () {
  if (PostModelType) {
    return PostModelType
  }

  PostModelType = await import(`../models/posts-${process.env.RADDICT_MODEL}`);
  return PostModelType;
}

export const events = _events;

export async function create(key, username, provider, familyname, gravatar, title, body, likes, views, likedBy, timestamp) {
 const post = await (await model()).create(key, username, provider, familyname, gravatar, title, body, likes, views,
  likedBy, timestamp);
_events.postCreated(post);
 return post // returning the promise
}

export async function update(key, username, provider, familyname, gravatar, title, body, likes, views, likedBy, timestamp) {
  const post = await (await model()).update(key, username, provider, familyname, gravatar, title, body, likes, views,
    likedBy, timestamp);
  _events.postUpdated(post);
  return post // returning the promise
}

export async function read(key) {
  return await (await model()).read(key); // returning the promise
}

export async function like(key, likedBy, likedOnceBy) {
  return await (await model()).like(key, likedBy, likedOnceBy);
}

export async function view(key) {
  return await (await model()).view(key);
}

export async function destroy(key) {
  await (await model()).destroy(key);
  _events.postDestroyed(key);
  return key; // returning the promise
}

export async function keylist() {
  return await (await model()).keylist(); // returning the promise
}

export async function count() {
  return await (await model()).count(); // returning the promise
}

export async function close() {
  return await (await model()).close(); // returning the promise
}
