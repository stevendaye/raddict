/* ## Setteing the Image model as an EventEmiter class ## */
/* Emitting event on image post and deletion */
import EventEmiter from "events";
import util from "util";
import DBG from "debug";

const debug = DBG("raddict:image-events");
const error = DBG("radddict:error-events");

class ImagesEmitter extends EventEmiter {
  imageCreated(image) {
    this.emit("imagecreated", image);
    debug(`'imagecreated' emitted successfuly. Image: ${util.inspect(image)}`);
  }
  imageDestroyed(data) {
    this.emit("imagedestroyed", data);
    debug(`imagedestroyed emitted successfuly. Image: ${util.inspect(data)}`);
  }
}

export default new ImagesEmitter;
