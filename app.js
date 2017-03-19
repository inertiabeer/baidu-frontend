var express = require('express');
var path = require('path');
var fs = require("fs");
var request = require('request');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dbURL = 'mongodb://localhost:27017/ife';
var db = mongoose.connect(dbURL);
var model = require('./model.js');
var crypto = require('crypto');
var async = require('async');
var child_process = require('child_process');


function md5(text) {
	return crypto.createHash('md5').update(text).digest('hex');
}

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/public/images'))
	// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

var exec = child_process.exec;
var num = 0;
io.on('connection', function(socket) {
	socket.on('client', function(content) {
		console.log(content);
		var queue = async.queue(function(item, callback) {
			exec("phantomjs task2.js " + item.keyword + " " + item.device + " " + item.page,
				function(err, stdout, stderr) {
					socket.emit('server', stdout);


					var obj = JSON.parse(stdout);
					var imgUrls = new Array();
					for (var i = 0; i < obj.dataList.length; i++) {
						if (obj.dataList[i].img !== "") {
							let url = obj.dataList[i].img;
							imgUrls.push(url);
						}

					}


					// for (let j = 0; j < imgUrls.length; j++) {
					// 	request(imgUrls[j]).pipe(fs.createWriteStream("public/images/" + md5(imgUrls[j]) + ".png"));
					// }//将读取图片的暂时屏蔽



					var newdata = new model({

						device: obj.device,
						code: obj.code,
						msg: obj.msg,
						word: obj.word,
						time: obj.time,
						dataList: obj.dataList

					});

					newdata.save(function(err, data) {
						if (err)
							console.log(err);
						else {
							//console.log(data);


						}

					});


				})

			callback();
		}, 5);
		queue.push(content, function(err) {
				console.log("完成");
			})
			// async.mapLimit(content, 5, function(item, callback) {
			// 		exec("phantomjs task2.js " + item.keyword + " " + item.device + " " + item.page,
			// 			function(err, stdout, stderr) {
			// 				socket.emit('server', stdout);


		// 				var obj = JSON.parse(stdout);
		// 				var imgUrls = new Array();
		// 				for (var i = 0; i < obj.dataList.length; i++) {
		// 					if (obj.dataList[i].img !== "") {
		// 						let url = obj.dataList[i].img;
		// 						imgUrls.push(url);
		// 					}

		// 				}


		// 				for (let j = 0; j < imgUrls.length; j++) {
		// 					request(imgUrls[j]).pipe(fs.createWriteStream("public/images/" + md5(imgUrls[j]) + ".png"));
		// 				}



		// 				var newdata = new model({

		// 					device: obj.device,
		// 					code: obj.code,
		// 					msg: obj.msg,
		// 					word: obj.word,
		// 					time: obj.time,
		// 					dataList: obj.dataList

		// 				});

		// 				newdata.save(function(err, data) {
		// 					if (err)
		// 						console.log(err);
		// 					else {
		// 						//console.log(data);


		// 					}

		// 				});


		// 			})
		// 		callback(false);



		// 	},
		// 	function(err, result) {
		// 		if (err)
		// 			console.log(err);
		// 		else {

		// 			console.log("正在爬取");

		// 		}
		// 	})


	})
})

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

server.listen(3000);