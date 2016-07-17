var express = require('express');
var exphbs  = require('express-handlebars');
var morgan = require("morgan");
var bodyParser = require("body-parser");
var env = require("dotenv").config();

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('views'));

require('./routes/routes')(app);


app.listen(process.env.PORT || 3000);