import fs from "fs-extra";
import path from "path";
import util from "util";
import DBG from "debug";
import moment from "moment";
import * as utils from "../middlewares/utilities";
import * as images from "../models/images-sequelize";
import * as comments from "../models/images-comments-sequelize.mjs";
import * as errorHandler from "../middlewares/errorHandler";
import config from "../config";

const debug = DBG("raddict:image-contollers");
const error = DBG("raddict:error-controllers");

const { post } = config.routes;

export default {
  async index (req, res, next) {
    try {
      let imagelist = await getAllImageList();
      res.render("images", {
        title: "Raddict | Pictures Feed",
        imagelist,
        user: req.user ? req.user : undefined
      });
    } catch (err) {
      error(`/posts/images ERROR ${err.stack}`);
      next(err);
    }
  },

  add (req, res, next) {
    try {
      res.render("image_edit", {
        title: "Raddict | Upload A Picture",
        tmestamp: "",
        user: req.user ? req.user : undefined
      });
    } catch (err) {
      error(`${post.image.add} ERROR ${err.stack}`);
      next(err);
    }
  },

  async create (req, res, next) {
    try {
      const timestamp = new Date();
      const likes = 0, views = 0, likedBy = [] ;
      utils.upload(req, res, async err => {
        debug(`Storing File to DiskStorage...`);
        if (err) {
          error(`Sorry -- ${err}`);
          res.render("image_edit", { message: err });
        } else if (!req.file || req.file === undefined) {
          res.render("image_edit", { message: "No File Was Selected!" });
        } else {
          const imagekey = `${req.file.filename}`.split(".").shift();
          const ext = `${req.file.originalname}`.split(".").pop().toLowerCase();
          const filename = `${imagekey}.${ext}`;

          const image = await images.create(imagekey, filename, req.body.username, req.body.provider, req.body.familyname,
            req.body.gravatar, req.body.caption, views, likes, likedBy, timestamp);
          debug(`Image created and stored in database: ${util.inspect(image)}`);
          res.redirect(`${post.image.view}?key=${imagekey}`);
        }
      });
    } catch (err) {
      error(`${post.image.create} ERROR ${err.stack}`);
      next(err);
    }
  },

  async view (req, res, next) {
    try {
      await images.view(req.query.key);
      const image = await images.find(req.query.key);
      if (image) {
        debug(`Viewing Image: ${util.inspect(image)}`);
        res.render("image_view", {
          image,
          imagekey: req.query.key,
          user: req.user ? req.user : undefined
        });
      } else {
        errorHandler.notExist(410);
      }
    } catch (err) {
      error(`${post.image.view} ERROR ${err.stack}`);
      next(err);
    }
  },

  async like (req, res, next) {
    try {
      const image = await images.find(req.body.key);
      if (image) {
        const thisimage = await images.like(req.body.key, req.body.likedBy, req.body.likedOnceBy);
        res.status(200).json({ thisimage, id: req.body.key });
        debug(`Total Likes: ${util.inspect(thisimage.likes)}`);
      } else {
        errorHandler.notExist(410);
      }
    } catch (err) {
      error(`${post.image.like} ERROR ${err.stack}`);
      res.status(500).end(err.stack);
    }
  },

  async likers(req, res, next) {
    try {
      const keylist = await images.keylist();
      const keyPromises = await keylist.map( key =>
        images.find(key).then( image => {
        return { key: image.key, likedBy: image.likedBy };
      }));
      const likelist = await Promise.all(keyPromises);
      res.status(200).json({ likelist });
    } catch (err) {
      error(`${post.image.likers} ERROR ${err.stack}`);
      next(err);
    }
  },

  async delete (req, res, next) {
    try {
      const image = await images.find(req.query.key);
      if (image) {
        res.render("image_delete", {
          title: "",
          image,
          imagekey: req.query.key,
          user: req.user ? req.user : undefined
        });
      } else {
        errorHandler.notExist(410);
      }
    } catch (err) {
      error(`${post.image.delete} ERROR ${err.stack}`);
      next(err);
    }
  },

  async deleteConfirmed (req, res, next) {
    try {
      const image = await images.find(req.body.imagekey);
      if (image) {
        await images.destroy(req.body.imagekey);
        await fs.unlink(path.resolve(`./static/uploads/media/pictures/${image.filename}`));
      } else {
        errorHandler.notExist(410);
      }
      res.redirect("/posts/images");
    } catch (err) {
      error(`${post.image.deleteConfirm} ERROR ${err.stack}`);
      next(err);
    }
  },

  async makeComment(req, res, next) {
    const timestamp = new Date();
    try {
      const image = await images.find(req.body.key);
      if (image) {
        await comments.imageComment(req.body.from, req.body.gravatar, req.body.namespace, req.body.comment, timestamp);
        debug(`imageComment function called successfully!`);
        res.status(200).json({ });
      } else {
        errorHandler.notExist(410);
      }
    } catch (err) {
      error(`${post.image.comment.make} ERROR ${err.stack}`);
      next(err);
    }
  },

  async likeComment (req, res, next) {
    res.status(200).json({ });
  },

  async deleteComment(req, res, next) {
    try {
      await comments.destroyComment(req.body.id, req.body.namespace);
      debug(`destroyComment function called successfully!`);
      res.status(200).json({ });
    } catch (err) {
      error(`${post.image.comment.delete} ERROR ${err.stack}`);
      next(err);
    }
  }
}

async function getAllImageList() {
  const keylist = await images.keylist();
  const keyPromises = keylist.map(key => images.find(key));
  return await Promise.all(keyPromises);
}

/* Socketio and Node events for image actions */
export function socketio(io) {
  io.of("/view").on("connection", socket => {
    debug(`Image view connected on ${socket.id}`);

    socket.on("getimagecomments", (namespace, cb) => {
      debug(`getimagescomments at ${namespace}`);
      comments.recentComments(namespace).then(cb)
      .catch(err => console.error(err.stack));
    })
  });

  comments.emitter.on("newcomment", newcmt => {
    debug(`New comment created. 'newcomment' event emitted from server`);
    io.of("/view").emit("newcomment", newcmt);
  });
  comments.emitter.on("destroycomment", data => {
    debug(`Comment destroyed. 'destroycomment' event emitted from the server`);
    io.of("/view").emit("destroycomment", data);
  });

  // Emitting events on image creation and deletion
  const emitNewImage = async () => {
    const imagelist = await getAllImageList();
    const freshimage = imagelist[0];
    let data = {};
    data["image"] = {
      key: freshimage.key,
      filename: freshimage.filename,
      username: freshimage.username,
      provider: freshimage.provider,
      familyname: freshimage.familyname,
      gravatar: freshimage.gravatar,
      caption: freshimage.caption,
      likes: freshimage.likes,
      views: freshimage.views,
      likedBy: freshimage.likedBy,
      timestamp: moment(freshimage.timestamp).startOf("seconds").fromNow()
    };
    debug(`imagelist: ${util.inspect(freshimage)}`);
    io.of("/home").emit("newimage", data);
  };
  images.events.on("imagecreated", emitNewImage);
  images.events.on("imagedestroyed", data => {
    io.of("/view").emit("imagedestroyed", data);
    io.of("/home").emit("imagedestroyed", data);
  });
}
