# 任务三  
我直接使用express的应用生成器，来减少一部分操作，
为了方便调试，我直接在app.js中加上了一句app.listen(3000);
**然后使用 node app.js 命令来直接运行程序**
###然后安装了mongoose，学习了一下mongoose的用法，
###还了解到了nodejs中的前后端交互，我查的是一本叫nodejs高级编程的书，里面的知识点相关性还是蛮高的
###利用form，传入查询的参数，然后在通过require('child_process')来调用子进程
###将返回的stdout存入mongoose中，
具体的文档，过几天再补上，太累了 ，休息一下。
`var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dbURL = 'mongodb://localhost:27017/ife';
var db = mongoose.connect(dbURL);
var model = require('./model.js');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

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
app.post('/baidu', function(req, res) {
	console.log(req.body.keyword);

	var child_process = require('child_process');
	var exec = child_process.exec;
	exec("phantomjs task2.js " + req.body.keyword + " ipad", function(err, stdout, stderr) {
		if (err) {
			console.log('child_process had some error' + err.code);
			return;
		}
		console.log(stdout);
		var obj = JSON.parse(stdout);
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
			else
				console.log(data);
		})



	});
	res.send("thank you");
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

app.listen(3000);`
