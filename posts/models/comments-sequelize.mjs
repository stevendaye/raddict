/* ## Setting up Sequelize to store comments ## */
import Sequelize from "sequelize";
import jsyaml from "js-yaml";
import fs from "fs-extra";
import EventEmitter from "events";
import util from "util";
import DBG from "debug";
import moment from "moment";

class CommentsEmitter extends EventEmitter {
  commentCreated(comment) {
    this.emit("newcomment", comment);
  }
  commentDestroyed(data) {
    this.emit("destroycomment", data);
  }
}

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

export async function postComment(from, namespace, comment, timestamp) {
  const SQComment = await connectDB();
  const newComment = await SQComment.create({ from, namespace, comment, timestamp });
  const thisComment = {
    id: newComment.id, from: newComment.from, namespace: newComment.namespace,
    comment: newComment.comment, timestamp: moment(newComment.timestamp).startOf("seconds").fromNow()
  };
  debug(`Created comment: ${util.inspect(newComment)}`);
  emitter.commentCreated(thisComment);
}

export async function destroyComment(id, namespace) {
  const SQComment = await connectDB();
  const comment = await SQComment.find({ where: { id: { [Op.eq]: id} } });
  if (comment) {
    comment.destroy();
    emitter.commentDestroyed({ id, namespace });
  }
  debug(`Deleted comment of id: ${id} from the namespace: ${namespace}`);
}

export async function recentComments(namespace) {
  const SQComment = await connectDB();
  const comments = await SQComment.findAll({
    where: { namespace: { [Op.eq]: namespace} }, order: ["timestamp"], limit: 20
  });
  debug(`Returning all recent comment from the namespace: ${namespace} -- ${util.inspect(comments)}`);
  return comments.map(comment => {
    return {
      id: comment.id, from: comment.from, namespace: comment.namespace,
      comment: comment.comment, timestamp: moment(comment.timestamp).startOf("seconds").fromNow()
    };
  });
}

export const emitter = new CommentsEmitter();
