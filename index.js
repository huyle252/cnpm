var express = require('express');
var app = express();
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var db = low(adapter);

db.defaults({ words: [] })
  .write();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


//import data from database
app.get('/', function(req, res){
  res.render('index', {
    words: db.get('words').value()
  });
});

app.get('/create', function(req, res){
  res.render('words/create');
});

//searching tool!
app.get('/search', function(req, res){
  var q = req.query.q;
  var matchedWords = db.get('words').value().filter(word => {
    return word.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  res.render('index',{
    words: matchedWords
  }).write();
});
app.get('/search2', function(req, res){
  var q = req.query.q;
  var matchedWords = db.get('words').value().filter(word => {
    return word.name2.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  res.render('index',{
    words: matchedWords
  }).write();
});

//add user to list => use for adding new words to dictionary
app.post('/create', function(req, res){
  db.get('words').push(req.body).write();
  res.redirect('/');
})


app.listen(3000, function(){
  console.log('Server listening');
});

