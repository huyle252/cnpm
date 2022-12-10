const express = require("express");
const app = express();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require('multer')
const url = `mongodb+srv://huyle252:family9788vn@cluster0.ote7who.mongodb.net/test`;
const path = require("path");

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const wordSchema = new mongoose.Schema(
  {
    data: Object,
  },
  { collection: `words` }
);

const Word = mongoose.model("Word", wordSchema);

const wordData = (bodyData) => {
  Word({ data: bodyData }).save((err) => {
    if (err) {
      throw err;
    }
  });
};

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.get('/', (req, res) => {
  res.render('home');
  
})
app.get("/create", (req, res) => {
  res.render("index");
});

app.post("/create", urlencodedParser, (req, res) => {
  wordData(req.body);
  res.render("success", { name: req.body.name });
  res.redirect('home');
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
  

server.listen(3000);