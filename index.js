const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');

const app = express();
// enable fileupload
app.use(
  fileUpload({
    createParentPath: true
  })
);

// add other middleware

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

const port = process.env.port || 80;

app.listen(port, () => console.log(`App is listening on port ${port}`));

app.use((req, res, next) => {
  req.url = req.originalUrl = decodeURIComponent(req.url);
  console.log(req.url);
  next();
});
app.post('/upload', async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      let file = req.files.file;
      console.log(file);
      filename = decodeURIComponent(file.name);
      file.mv('./uploads/' + filename);

      res.send({
        status: true,
        message: 'File is uploaded',
        data: {
          name: filename,
          mimetype: file.mimetype,
          size: file.size
        }
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/file/:filename(*)', async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.resolve(__dirname, 'uploads', filename);
  // /Users/yang/Projects/blogs/ngx-dev/uploads/8h.xls
  res.download(filePath, filename, (err) => console.log(err));
});
