//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan'),
    Feed = require('feed');

/*var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: 40510});

wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    console.log('received: %s', message)
  })
});*/
var ws = require('./ws')

Object.assign=require('object-assign')
const webpush = require('web-push');

const publicVapidKey = "BJDV2UtuOj35ywfQnhgStMD_6KWQdI6aRa0Tq7J8laG9CBEZcng7_3bR23MdJOBA-GaXyL2mDiQXHxY8JwSVcG8"; //process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = "jtvj6H21BJ63Qimb0l3ptd3zAKQ7jsdcUTtyTbyagFc"; //process.env.PRIVATE_VAPID_KEY;
webpush.setVapidDetails('mailto:reach.to.girish@gmail.com', publicVapidKey, privateVapidKey);

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))
var loneSubscriber;
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};

app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: Date.now()});
    col.count(function(err, count){
      if (err) {
        console.log('Error running count. Message:\n'+err);
      }
      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
    });
  } else {
    res.render('index.html', { pageCountMessage : null});
  }
});

app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

app.use(require('body-parser').json());

app.post('/subscribe', (req, res) => {
  //const subscription = req.body;
  loneSubscriber = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title: 'test' ,actionName: 'startshow'});

  console.log(loneSubscriber);

  webpush.sendNotification(loneSubscriber, payload).catch(error => {
    console.error(error.stack);
  });
});

app.get('/sendmsg',(req, res) => {
  //const subscription = req.body;
	console.log('received GET call' + req.query);
  //loneSubscriber = req.body;
  res.status(200).json({});
  //var payload = JSON.stringify({ title: 'set_new_value' });
  var payload = '{ "action":"' + req.query.actionname +'"}';

  //console.log(subscription);
  //wss.send(payload);
  webpush.sendNotification(loneSubscriber, payload).catch(error => {
    console.error(error.stack);
  });
});

app.post('/sendMessageToClient', (req, res) => {
	console.log('received POST call' + req.query);
  //const subscription = req.body;
  //loneSubscriber = req.body;
  res.status(200).json({});
  //var payload = JSON.stringify({ title: 'set_new_value' });
  var payload = JSON.stringify(req.body);
	//payload.title = req.body.msg;
	
  //console.log(subscription);
  //wss.send(payload);
  webpush.sendNotification(loneSubscriber, payload).catch(error => {
    console.error(error.stack);
  });
});

app.get('/feed/rss/sie', function (req, res) {

    // Get the posts from the database or whatever data store you are using, I am simply goin to use in memory array
    var posts = [
        {
            title: "Post 1",
            summary: "Post 1 summary",
            content: "Post 1 content",
            pubdate: new Date(),
            slug: 'post-1'
        },
        {
            title: "Post 2",
            summary: "Post 2 summary",
            content: "Post 2 content",
            pubdate: new Date(),
            slug: "post-2"
        },
        {
            title: "Post 3",
            summary: "Post 3 summary",
            content: "Post 3 content",
            pubdate: new Date(),
            slug: "post-3"
        },
        {
            title: "Post 4",
            summary: "Post 4 summary",
            content: "Post 4 content",
            pubdate: new Date(),
            slug: "post-4"
        }
    ];

    // Instantiate feed object

    var feed = new Feed({
        title: 'Example',
        description: "An interesting site which talks sense",
        link: "http://example.com"
    });

    //add posts

    posts.forEach(function (p) {
        feed.addItem({
            title: p.title,
            link: "http://example.com/" + p.slug,
            description: p.summary,
            date: p.pubdate
        });
    });

    //add categories

    feed.addCategory('Technology');
    feed.addCategory('Programming');
    feed.addCategory('Web Development');

    //render xml in rss or atom format depending upon the url param

    var feedRes = feed.render('rss-2.0');
    
    res.set('Content-Type', 'text/xml');
    res.send(feedRes);
});

app.use(require('express-static')('./'));

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});
app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
