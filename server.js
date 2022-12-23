const express = require("express");
const app = express();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const url = `mongodb+srv://huyle252:family9788vn@cluster0.ote7who.mongodb.net/test`;

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
    res.render('list',{ Word: allWord });
    };
});
});
app.get("/create", (req, res) => {
  res.render("index");
});

app.post("/create", urlencodedParser, (req, res) => {
  wordData(req.body);
  res.render('sound');
});

app.get('/list/search', (req, res, next) => {
    let bana = [req.query.Bahnaric].flat();
    let query = {
    Bahnaric: {
         "$in": bana
     }
    }
    Word.find(query, function (err, foundWord) {
         if (err) {
             console.log(err);
         } else {
             res.send({Word: foundWord});
         }
     });
  }
)

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
   cb(null, './audio/newwords');
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});

var upload = multer({ storage: storage })

app.post('/uploadfile', upload.single('audiosound'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file)
})

server.listen(3000);