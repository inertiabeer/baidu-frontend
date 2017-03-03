var page = require('webpage').create();
var system = require('system');
var fs = require('fs');

var device = fs.read('device.json');

var o_device = JSON.parse(device);



var time = Date.now();
var keyword = system.args[1];
var phone = system.args[2];
var pages = 10 * (system.args[3] - 1);


var width, useragent, height;

for (var m_phone in o_device) {

	if (phone.toLowerCase() == m_phone.toLowerCase()) {



		width = o_device[m_phone].width;

		height = o_device[m_phone].height;
		useragent = o_device[m_phone].uA;
	}
}



page.settings.userAgent = useragent || " ";

page.viewportSize = {
	width: width,
	height: height
};
var dataList = [];
var url;


//for (var leaf = (pages - 1) * 10; pages > 0; pages = pages - 1) {
url = "http://www.baidu.com/s?wd=" + keyword + "&pn=" + pages;
page.open(url, function(s) {



	page.includeJs('jquery.js', function() {
		Array.prototype.push.apply(dataList, page.evaluate(

			function(pages) {
				var datas = [];

				$(".result").map(function() {
					datas.push({
						title: $(this).find('.t>a').text(),
						info: $(this).find(".c-abstract").text(),
						link: $(this).find(".t>a").attr('href'),
						img: $(this).find('.c-img').attr('src') || ''

					})
				});



				return datas;



			}
		));
		var result = {
			device: phone,
			pages: pages,
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

//}