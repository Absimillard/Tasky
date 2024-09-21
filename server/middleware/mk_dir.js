const fs = require('fs');
const path = require('path');

const dir = (req, res, next) => {
  const newDir = path.join(__dirname, '..', '..', 'client', 'public', 'assets', `${req.headers['x-path']}`);
  if (!fs.existsSync(newDir)) {
    fs.mkdirSync(newDir, { recursive: true });
  }
  next();
};

module.exports = dir;
