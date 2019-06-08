CREATE TABLE IF NOT EXISTS posts(
  postkey VARCHAR(255) UNIQUE PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  familyname VARCHAR(255),
  gravatar VARCHAR(255) UNIQUE,
  title VARCHAR(255),
  body TEXT,
  timestamp DATE
);
