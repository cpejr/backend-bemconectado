const multer = require('multer');
var storage = multer.memoryStorage()

const multerImageUploader = multer({
  storage: storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
      cb(null, true);
    else cb({ error: `Tipo de imagem (${file.mimetype}) não é permitido, por favor selecione arquivos jpeg ou png.` }, false);
  }
});

const imageUpload = (imageName) => {
  return (req, res, next) => {
    multerImageUploader.single(imageName)(req, res, function (err) {
      if (err) {
        return res.status(400).json(err);
      }
      next();
    });
  };
};

module.exports = imageUpload;
