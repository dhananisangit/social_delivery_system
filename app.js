var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var sendPackage = require('./routes/sendPackage.js');
var postTrip = require('./routes/postTrip.js');
var mongoSessionURL = "mongodb://sangitdhanani:sjsu1234@ds133211.mlab.com:33211/sds_mongo"

// var sendPackage = require('./routes/sendPackage.js');
// var mongoSessionURL = "mongodb://localhost:27017/social_delivery_system";

// var sendPackage = require('./routes/sendPackage.js');
// var mongoSessionURL = "mongodb://sangitdhanani:sjsu1234@ds133211.mlab.com:33211/sds_mongo"

// var mongoSessionURL = "mongodb://localhost:27017/social_delivery_system"
var expressSessions = require("express-session");
var passport = require('passport');
var mongoStore = require("connect-mongo/es5")(expressSessions);

var app = express();

app.use(expressSessions({
	  secret: "sds",
	  resave: false,
	  saveUninitialized: false,
	  duration: 30 * 60 * 1000,
	  activeDuration: 5 * 6 * 1000,
	  store: new mongoStore({
	    url: mongoSessionURL
	  })
	}));
	app.use(passport.initialize());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/login', index);
app.use('/signout', index);
app.use('/register', index);
app.use('/profile', index);
app.use('/home', index);


app.use('/send', sendPackage.sendPackage);
app.use('/search', postTrip.postTrip)
app.use('/inbox', users.inbox)
// app.get('/users', users);
app.post('/v1/authenticateuser', users.login)

app.post('/v1/getcustomerfeedback', admin.getCustomerFeedback)
app.post('/v1/getcustomerDetails', admin.getCustomerDetails)
// admin
app.use('/admin', admin.home);
app.get('/v1/getcustomerlist', admin.getCustomerList)
app.get('/v1/getbilllist', admin.getBillList)
app.get('/v1/getopenshipperrequests', admin.getOpenShipperRequests)
app.get('/v1/getopenshipperrequestsforuser', admin.getOpenShipperRequests)
app.get('/v1/getopentransporterrequests', admin.getOpenTransporterRequests)
app.get('/v1/revenueperlocation', admin.revenuePerLocation)
app.get('/v1/tripsperlocation', admin.tripsPerLocation)
app.get('/v1/ridesperarea', admin.ridesPerArea)
app.get('/v1/ridesperdriver', admin.ridesPerDriver)

//customerList
app.use('/user', users.home);
app.get('/v1/getuserprofile', users.getCustomerDetails);
app.use('/v1/edituserprofile', users.updateCustomerProfile);
app.use('/v1/editusercc', users.updateCustomerCC);
app.use('/v1/changeuserpassword', users.updateCustomerPassword);
app.get('/v1/getdeliverydetails', users.getSingleDeliveryRequest);
app.get('/v1/getdeliverylist', users.getAllDeliveryRequests);
app.get('/v1/getshipperrequests', users.getOpenShipperRequests)
app.use('/v1/editdeliverydetails', users.updateDeliveryRequest);
app.get('/v1/deletedeliveryrequest', users.deleteDeliveryRequest);
app.use('/v1/sendpackage', users.sendPackage);
app.get('/v1/searchtask', users.searchTask);
app.get('/v1/makeoffer', users.makeOffer);
app.use('/v1/acceptoffer', users.acceptOffer);
app.get('/v1/gettasklist', users.getTaskList);
app.get('/v1/gettriplist', users.getTripList);
app.use('/v1/completetrip', users.completeTrip);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
