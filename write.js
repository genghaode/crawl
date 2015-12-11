var mysql = require('mysql');
var debug = require('debug')('crawl:write');
var async = require('async');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	// password: '123456',
	database: 'crawl'
});
connection.connect();

exports.classList = function(classList, callback){
	debug('保存文章分类列表');
	var sql = 'replace into class_list(id, name, url) values(?, ?, ?)';
	async.eachSeries(classList, function(item, next){
		var value = [item.id, item.name, item.url];
		connection.query(sql, value, next);
	}, callback);
};

exports.classArticles = function(class_id, list, callback){
	debug('保存分类下面的文章列表：%d', class_id);
	var sql = 'replace into article_list(id, title, url, postdate, class_id) values(?, ?, ?, ?, ?)'
	async.eachSeries(list, function(item, next){
		var value = [item.id, item.title, item.url, item.time, class_id];
		connection.query(sql, value, next);
	}, callback);
};

exports.articleDetail = function(id, title, tags, content, callback){
	debug('保存文章的详情：%d', id);
	var sql = 'replace into article_detail(id, title, tags, content) values(?, ?, ?, ?)';
	var value = [id, title, tags.join(','), content];
	connection.query(sql, value, callback);
};


