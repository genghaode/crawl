var debug = require('debug')('crawl:app');
var async = require('async');
var read = require('./read');
var write = require('./write');

var classList;
var classArticles = {};
var articles = [];
var url = 'http://blog.csdn.net/hongqishi';

async.series([function(cb){
	read.classList(url, function(err, list){
		classList = list;
		cb(err);
	});
}, function(cb){
	write.classList(classList, cb);
}, function(cb){
	async.eachSeries(classList, function(result, next){
		read.classArticles(result.url, function(err, list){
			if(list.length != 0){
				classArticles[result.id] = list;
			}		
			next(err);
		});
	}, cb);
}, function(cb){
	debug('删除重复文章');
	var article = {};
	Object.keys(classArticles).forEach(function(class_id){
		classArticles[class_id].forEach(function(item){
			article[item.id] = item;
		});
	});
	Object.keys(article).forEach(function(id){
		articles.push(article[id]);
	});
	cb();
}, function(cb){
	debug('保存文章详情');
	async.eachSeries(articles, function(item, next){
		read.articleDetail(item.url, function(err, result){
			write.articleDetail(item.id, item.title, result.tags, result.content, next);
		});
	}, cb);
}], function(err, result){
	if(err){
		console.log(err);
	}
	console.log('done');
});


