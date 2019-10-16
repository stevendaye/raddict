/* ## Setting up Sequelize to store chat messages ## */
import Sequelize from "sequelize";
import jsyaml from "js-yaml";
import fs from "fs-extra";
import EventEmitter from "events";
import util from "util";
import DBG from "debug";

class MessageEmitter extends EventEmitter {}

const debug = DBG("raddict:model-messsages");
const error = DBG("raddict:error-messages");
const Op = Sequelize.Op;

var SQMessage;
var Sqlize;

async function connectDB() {
  if (typeof Sqlize === "undefined") {
    const YAML = await fs.readFile(process.env.SEQUELIZE_CONNECT, "utf8");
    const params = jsyaml.safeLoad(YAML, "utf8");

    Sqlize = new Sequelize(params.dbname, params.username, params.password, params.params);
  }

  if (SQMessage) {
    return SQMessage.sync();
  }

  SQMessage = Sqlize.define("Message", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    from: Sequelize.STRING,
    namespace: Sequelize.STRING,
    message: Sequelize.STRING(1024),
    timestamp: Sequelize.DATE
  });
  return SQMessage.sync();
}

export async function postMessage(from, namespace, message) {
  const SQMessage = await connectDB();
  const newMessage = await SQMessage.create({
    from, namespace, message, timestamp: new Date()
  });
  const theMessage = {
    id: newMessage.id, from: newMessage.from, namespace: newMessage.namespace,
    message: newMessage.message, timestamp: newMessage.timestamp
  };

  emitter.emit("newmessage", theMessage);
  return newMessage;
}

export async function destroymessage(id, namespace) {
  const SQMessage = await connectDB();
  const message = SQMessage.find({ where: { id: { [Op.eq]: id} } });
  if (message) {
    message.destroy();
    emitter.emit("destroymessage", { id, namespace });
  }
  return message;
}

export async function recentMessages(namespace) {
  const SQMessage = await connectDB();
  const messages = SQMessage.findAll({
    where: { [Op.eq]: namespace }, order: ["timestamp"], limit: 20
  });
  return messages.map(message => {
    return {
      id: message.id, from: message.from, namespace: message.namespace,
      message: message.message, timestamp: message.timestamp
    };
  });
}

export const emitter = new MessageEmitter();
