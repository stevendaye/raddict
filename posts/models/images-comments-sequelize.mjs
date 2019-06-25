/* ## Storing Comments on images in the dabase ## */
import Sequelize from "sequelize";
import jsyaml from "js-yaml";
import DBG from "debug";
import fs from "fs-extra";
import EventEmitter from "events";
import util from "util";
import moment from "moment";

class CommentsEmmitter extends EventEmitter {
  commentCreated(comment) {
    this.emit("newcomment", comment);
  }
  commentDestroyed(data) {
    this.emit("destroycomment", data);
  }
}

const debug = DBG("raddict:image_comment-sequelize");
const error =  DBG("raddict:image_error-sequelize");
const Op = Sequelize.Op;

var Sqlize;
var SQComment;

async function connectDB() {
  if (typeof Sqlize === "undefined") {
    const YAML = await fs.readFile(process.env.SEQUELIZE_CONNECT, "utf8");
    const params = jsyaml.safeLoad(YAML, "utf8");

    Sqlize = new Sequelize(params.dbname, params.username, params.password, params.params);
  }

  if (SQComment) {
    return SQComment.sync();
  }

  SQComment = Sqlize.define("ImgComment", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    from: Sequelize.STRING,
    gravatar: Sequelize.STRING,
    namespace: Sequelize.STRING,
    comment: Sequelize.STRING(1024),
    timestamp: Sequelize.DATE
  });
  return SQComment.sync();
}

async function imageComment(from, gravatar, namespace, comment, timestamp) {
  const SQComment = await connectDB();
  const newComment = await SQComment.create({ from, gravatar, namespace, comment, timestamp });
  const thisComment = {
    id: newComment.id, from: newComment.from, gravatar: newComment.gravatar, namespace: newComment.namespace,
    comment: newComment.comment, timestamp: moment(newComment.timestamp).startOf("seconds").fromNow()
  }
  debug(`Created Image Comment: ${util.inspect(newComment)}`);
  emitter.commentCreated(thisComment);
}

async function destroyComment(id, namespace) {
  const SQComment = await connectDB();
  const comment = await SQComment.find({ where: { id: { [Op.eq]: id } } });
  if (comment) {
    comment.destroy();
    emitter.commentDestroyed({ id, namespace });
  }
  debug(`Deleted comment of id: ${id} from namespace: ${namespace}`);
}

async function recentComments(namespace) {
  const SQComment = await connectDB();
  const comments = await SQComment.findAll({
    where: { namespace: { [Op.eq]: namespace } }, order: ["timestamp"], limit: 25
  });
  debug(`Returning all recents image comments from the namespace: ${namespace} -- ${util.inspect(comments)}`);
  return comments.map(comment => ({
    id: comment.id, from: comment.from, gravatar: comment.gravatar, namespace: comment.namespace,
    comment: comment.comment, timestamp: moment(comment.timestamp).startOf("seconds").fromNow()
  }));
};

export { imageComment, destroyComment, recentComments };

export const emitter = new CommentsEmmitter();
