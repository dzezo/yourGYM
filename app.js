var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');

// Connect To Database
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useMongoClient: true });
mongoose.connection.on('connected', function () {
	console.log('Connected to database ' + config.database);
});
mongoose.connection.on('err', function (err) {
	console.log('Database error: ' + err);
});

var app = express();

// Routers
var users = require('./routes/users');
var members = require('./routes/members');
var pricelists = require('./routes/pricelists');

// Port Number
var port = process.env.PORT || 8080;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Routes
app.use('/users', users);
app.use('/members', members);
app.use('/pricelists', pricelists);

// Index Route
app.get('/', function (req, res) {
	res.send('Invalid Endpoint');
});

// Start Server
app.listen(port, function () {
	console.log('Server started on port ' + port);
});