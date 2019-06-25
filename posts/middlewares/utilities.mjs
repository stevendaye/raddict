/* ## Creating the app's utilities ## */
import multer from "multer";
import uuid from "uuid/v4";
import util from "util";
import DBG from "debug";
import config from "../config";

const debug = DBG(`raddict:posts-utilities`);
const error = DBG(`raddict:error-utilities`);

const templateRoutes = (req, res, next) => {
  res.locals.routes = config.routes;
  next();
};

// Passport authentication middleware
const requireAuthentication = (req, res, next) => {
  try {
    if (req.user) {
      debug(`req.session.passport: ${util.inspect(req.session.passport)}`);
      debug(`req.cookies: ${req.cookies}`);
      next();
    } else {
      res.redirect(config.routes.user.login);
    }
  } catch (err) {
    error(`requireAuthentication: Error Occured!`);
    next(err);
  }
};

// Uploading Image files with multer
const storage = multer.diskStorage({
  destination: "./static/uploads/media/pictures",
  filename: (req, file, callback) => {
    const imgid = uuid();
    const ext = file.originalname.split(".").pop().toLowerCase();
    callback(null, `${imgid}-${Date.now()}.${ext}`);
    debug(`Preparing file to store: ${file}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: (1024*1024)*7
  },
  fileFilter: (req, file, callback) => {
    sanitizeFile(file, callback);
  }
}).single("post-image");

// Handling Image validation on the server sides
const sanitizeFile = (file, callback) => {
  const FILE_EXT = ["jpeg", "jpg", "png", "gif"];
  const ALLOWED_EXT = FILE_EXT.indexOf((file.originalname.split(".")[1]).toLowerCase());
  const ALLOWED_MIMETYPE = file.mimetype.startsWith("image/");
  const FILE_SIZE = true;

  let ALLOW_STORAGE_TO_DISK;
  FILE_SIZE ? ALLOW_STORAGE_TO_DISK = true : ALLOW_STORAGE_TO_DISK = false;

  saveFileToDisk(ALLOWED_EXT, ALLOWED_MIMETYPE, ALLOW_STORAGE_TO_DISK, callback);
};

function saveFileToDisk (ALLOWED_EXT, ALLOWED_MIMETYPE, ALLOW_STORAGE_TO_DISK, callback) {
  if (ALLOWED_EXT && ALLOWED_MIMETYPE && ALLOW_STORAGE_TO_DISK) {
    debug(`File Upload Allowed. Proceeding to storing...`)
    return callback(null, true);
  } else {
    error(`File Upload Denied`);
    return callback("Error: FileType Not Allowed. Be sure to choose between the .jpg, .jpeg, .gif and .png extensions");
  }
}

export { templateRoutes, requireAuthentication, upload };
