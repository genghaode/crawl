var request = require('request');
var cheerio = require('cheerio');
var debug = require('debug')('crawl:read');

exports.classList = function(url, callback){
	debug('读取文章分类信息：%s', url);
	request(url, function(err, res){
		if(err){
			return callback(err);
		}
		var $ = cheerio.load(res.body.toString());
		var classList = [];
		$('#panel_Category li a').each(function(){
			var $this = $(this);
			var item = {
				name: $this.text().trim(),
				url: 'http://blog.csdn.net'+$this.attr('href')
			};
			var s = item.url.match(/\/article\/category\/(\d+)/);
			if(Array.isArray(s)){
				item.id = s[1];
				classList.push(item);
			}
			classList.push(item);
		});
		callback(err, classList);
	});
};

exports.classArticles = function(url, callback){
	debug('读取分类下的文章列表：%s', url);
	request(url, function(err, res){
		if(err){
			return callback(err);
		}
		var articleList = [];
		var $ = cheerio.load(res.body.toString());
		$('#article_list .list_item').each(function(){
			var $this = $(this);
			var $title = $this.find('.link_title a');
			var $time = $this.find('.link_postdate');
			var item = {
				title: $title.text().trim(),
				url: 'http://blog.csdn.net'+$title.attr('href'),
				time: $time.text().trim()
			};
			var s = item.url.match(/\/article\/details\/(\d+)/);
			if(Array.isArray(s)){
				item.id = s[1];
			}
			articleList.push(item);
		});
		callback(err, articleList);
	});
};

exports.articleDetail = function(url, callback){
	debug('读取文章的详情：%s', url);
	request(url, function(err, res){
		if(err){
			return callback(err);
		}
		var $ = cheerio.load(res.body.toString());
		var tags = [];
		$('.tagBox a').each(function(){
			var tag = $(this).text().trim();
			if(tag){
				tags.push(tag);
			}
		});
		var item = {
			tags: tags,
			content: $('#article_content').html().trim()
		};
		callback(err, item);
	});
};
