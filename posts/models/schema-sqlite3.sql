CREATE TABLE IF NOT EXISTS posts(
  postkey VARCHAR(255) UNIQUE PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  provider VARCHAR(16),
  familyname VARCHAR(255),
  gravatar VARCHAR(255) UNIQUE,
  title VARCHAR(255),
  body TEXT,
  likes INTEGER,
  views INTEGER,
  likedBy OBJECT,
  timestamp DATE
);
