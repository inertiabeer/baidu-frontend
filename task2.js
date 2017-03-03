var page = require('webpage').create();
var system = require('system');
var fs = require('fs');

var device = fs.read('device.json');

var o_device = JSON.parse(device);



var time = Date.now();
var keyword = system.args[1];
var phone = system.args[2];
var width, useragent, height;

for (var m_phone in o_device) {

	if (phone.toLowerCase() == m_phone.toLowerCase()) {



		width = o_device[m_phone].width;

		height = o_device[m_phone].height;
		useragent = o_device[m_phone].uA;
	}
}



var url = "http://www.baidu.com/s?wd=" + encodeURIComponent(keyword);
page.settings.userAgent = useragent || " ";

page.viewportSize = {
	width: width,
	height: height
}; //指定浏览器窗口的大小height必须指定
page.open(url, function(s) {


	page.includeJs('jquery.js', function() {
		var dataList = page.evaluate(

			function() {

				return $(".result").map(function() {
					return ({
						title: $(this).find('.t>a').text(),
						info: $(this).find(".c-abstract").text(),
						link: $(this).find(".t>a").attr('href'),
						img: $(this).find('.c-img').attr('src') || ''

					})
				}).toArray();



			});
		var result = {
			device: phone,
			code: 1,
			msg: "抓取成功",
			word: keyword,
			time: Date.now() - time,
			dataList: dataList

		};

		console.log(JSON.stringify(result));

		page.clipRect = {
			left: 0,
			top: 0,
			width: width,
			height: height
		};
		page.render('1.png');

		phantom.exit();



	});



});