/* ## Setting the Post model as an EventEmitter class ## */
import EventEmitter from "events";

class PostsEmitter extends EventEmitter {
  postCreated (post) {
    this.emit("postcreated", post);
  }
  postUpdated (post) {
    this.emit("postupdated", post);
  }
  postDestroyed(data) {
    this.emit("postdestroyed", data);
  }
}

export default new PostsEmitter();
