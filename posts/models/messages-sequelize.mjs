/* ## Setting up Sequelize to store comments ## */
import Sequelize from "sequelize";
import jsyaml from "js-yaml";
import fs from "fs-extra";
import EventEmitter from "events";
import util from "util";
import DBG from "debug";

class commentEmitter extends EventEmitter {}

const debug = DBG("raddict:model-comments");
const error = DBG("raddict:error-comments");
const Op = Sequelize.Op;

var SQComment;
var Sqlize;

async function connectDB() {
  if (typeof Sqlize === "undefined") {
    const YAML = await fs.readFile(process.env.SEQUELIZE_CONNECT, "utf8");
    const params = jsyaml.safeLoad(YAML, "utf8");

    Sqlize = new Sequelize(params.dbname, params.username, params.password, params.params);
  }

  if (SQComment) {
    return SQComment.sync();
  }

  SQComment = Sqlize.define("Comment", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    from: Sequelize.STRING,
    namespace: Sequelize.STRING,
    comment: Sequelize.STRING(1024),
    timestamp: Sequelize.DATE
  });
  return SQComment.sync();
}

export async function postComment(from, namespace, comment) {
  const SQComment = await connectDB();
  const newComment = await SQComment.create({
    from, namespace, comment, timestamp: new Date()
  });
  const theComment = {
    id: newComment.id, from: newComment.from, namespace: newComment.namespace,
    comment: newComment.comment, timestamp: newComment.timestamp
  };

  emitter.emit("newcomment", theComment);
  return newComment;
}

export async function destroyComment(id, namespace) {
  const SQComment = await connectDB();
  const comment = SQComment.find({ where: { id: { [Op.eq]: id} } });
  if (comment) {
    comment.destroy();
    emitter.emit("destroycomment", { id, namespace });
  }
  return comment;
}

export async function recentMessages(namespace) {
  const SQComment = await connectDB();
  const comments = SQComment.findAll({
    where: { [Op.eq]: namespace }, order: ["timestamp"], limit: 20
  });
  return comments.map(comment => {
    return {
      id: comment.id, from: comment.from, namespace: comment.namespace,
      comment: comment.comment, timestamp: comment.timestamp
    };
  });
}

export const emitter = new commentEmitter();
