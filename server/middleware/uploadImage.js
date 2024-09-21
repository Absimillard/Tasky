const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const locationDir = path.join(__dirname, '..', '..', 'client', 'public','assets', `${req.headers['x-path']}`);
    cb(null, locationDir);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s/g, '_');
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'application/pdf' ||
      file.mimetype == 'application/msword' ||
      file.mimetype == 'audio/mpeg' ||
      file.mimetype == 'audio/wav' ||
      file.mimetype == 'audio/mp3'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg, .jpeg, .mp3, .wav and .mpeg format allowed!'));
    }
  },
});

const Upload = (req, res) => {
  try {
    upload.any()(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while uploading the files.' });
      } else if (err) {
        // An unknown error occurred when uploading.
        console.error(err);
        return res.status(500).json({ error: 'An unknown error occurred while uploading the files.' });
      }
      
      // Everything went fine, send a success response.
      res.sendStatus(200);
    });
  } catch (error) {
    // Catch any other errors that might occur.
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};

module.exports = { Upload };
