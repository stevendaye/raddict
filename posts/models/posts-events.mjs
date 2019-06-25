/* ## Setting the Post model as an EventEmitter class ## */
/* Emitting events on post creation, deletion and update */
import EventEmitter from "events";
import util from "util";
import DBG from "debug";

const debug = DBG("raddict:posts-events");
const error = DBG("raddict:error-events");

class PostsEmitter extends EventEmitter {
  postCreated (post) {
    this.emit("postcreated", post);
    debug(`postcreated emitted successfuly. Post: ${util.inspect(post)}`);
  }
  postUpdated (post) {
    this.emit("postupdated", post);
    debug(`postupdated emitted successfuly. Post: ${util.inspect(post)}`);
  }
  postDestroyed(data) {
    this.emit("postdestroyed", data);
    debug(`postdestroyed emitted successfuly. Post: ${util.inspect(data)}`);
  }
}

export default new PostsEmitter();
