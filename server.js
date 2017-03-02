/**
 * Created by arun
 */

var express         =   require('express');
var bodyParser      =   require('body-parser');
var mongoose        =   require('mongoose');
var serveIndex      =   require('serve-index');
var config          =   require('./modules/config');

var eventBrite      =   require('./routes/eventBrite');

var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var server = app.listen(config.serverPort, function () {

    var host = server.address().address;
    var port = server.address().port;
    console.log("Server Started \n  listening at port : %s", port);

});



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/eventBrite', eventBrite);

app.get('/',function (req,res) {
    res.send("hey.. It workzz")
});


var dbURI = config.dbURI;
mongoose.connect(dbURI);


mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});