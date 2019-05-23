/* ## Dynamically Selecting a Data Model for Raddict ## */
import _events from "./posts-events";

let PostModelType;

async function model () {
  if (PostModelType) {
    return PostModelType
  }

  PostModelType = await import(`../models/posts-${process.env.RADDICT_MODEL}`);
  return PostModelType;
};

export const events = _events;

export async function create(key, title, body) {
 const post = await (await model()).create(key, title, body);
_events.postCreated(post);
 return post // returning the promise
};

export async function update(key, title, body) {
  const post = await (await model()).update(key, title, body);
  _events.postUpdated(post);
  return post // returning the promise
};

export async function read(key) {
  return await (await model()).read(key); // returning the promise
};

export async function destroy(key) {
  await (await model()).destroy(key);
  _events.postDestroyed(key);
  return key; // returning the promise
}

export async function keylist() {
  return await (await model()).keylist(); // returning the promise
};

export async function count() {
  return await (await model()).count(); // returning the promise
}

export async function close() {
  return await (await model()).close(); // returning the promise
}
