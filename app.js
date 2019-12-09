var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');


var router = require('./router');

var app = new express();

app.engine('html', require('express-art-template'));

app.use('/public/',express.static(path.join(__dirname,'/public/')));
app.use('/node_modules/',express.static(path.join(__dirname, './node_modules/')));

// Node中 很多第三方引擎
// ejs、jade(pug)、handlebars、nunjucks


// 默认是views目录，若想要修改路径这样改
// app.set('views',path.join(__dirname,'./views/'));


// 配置bodyParser 
// 在router之前
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())

// 在router之前
// 配置session
// req.session来访问与设置
// 添加：req.session.foo = 'bar';
// 访问：req.session.foo
app.use(session({
  secret: 'keycat',
  resave: false,
  saveUninitialized: true,
}))




// 把路由挂载到app中
app.use(router);



// 处理404页面
app.use(function(req,res){
  res.render('404.html');
})

app.listen('3000',function(){
  console.log('server is running');
})

