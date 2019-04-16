/* ## Dynamically Selecting a Data Model for Raddict ## */
var PostModelType;

async function model () {
  if (PostModelType) {
    return PostModelType
  }

  PostModelType = await import(`../models/posts-${process.env.RADDICT_MODEL}`);
  return PostModelType;
};

export async function create(key, title, body) {
 return (await model()).create(key, title, body);
};

export async function update(key, title, body) {
  return (await model()).update(key, title, body);
};

export async function read(key) {
  return (await model()).read(key);
};

export async function destroy(key) {
  return (await model()).destroy(key);
}

export async function keylist() {
  return (await model()).keylist();
};

export async function count() {
  return (await model()).count();
}

export async function close() {
  return (await model()).close();
}
