const express = require("express");
const app = express();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const url = `mongodb+srv://huyle252:family9788vn@cluster0.ote7who.mongodb.net/test`;
var MongoClient = require('mongodb').MongoClient;


mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const wordSchema = new mongoose.Schema(
  {
    Vietnamese: String,
    Bahnaric: String,
    PoS: String,
    BinhDinh: String,
    KonTum: String,
    GiaLai: String
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

app.get('/', (req,res) => {
  res.render('home');
});
app.get('/list', (req, res, next) => {
  Word.find({}, function(err, allWord) {
    if (err) throw err;
    else {
  res.render('list',{ Word: allWord })};
  });
});
app.get("/create", (req, res) => {
  res.render("index");
});

app.post("/create", urlencodedParser, (req, res) => {
  wordData(req.body);
  res.render('sound');
});

server.listen(3001);