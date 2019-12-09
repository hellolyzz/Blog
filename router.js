var express = require('express');

var router = express.Router();

var User = require('./models/user');

var md5 = require('blueimp-md5');

router.get('/', function (req, res) {
  console.log(req.session.user);
  res.render('index.html', {
    user: req.session.user
  })
})

router.get('/register', function (req, res) {
  res.render('register.html')
})

router.post('/register', function (req, res) {
  // 1.获取表单提交数据 req.body
  // 2.操作数据库
  // 判断是否存在。存在不允许注册,不存在新建业务save
  // 3.发送响应
  var body = req.body;
  User.findOne({
    $or: [ //或者查询条件表示法
      {
        email: body.email
      },
      {
        nickname: body.nickname
      }
    ]
  }, function (err, data) {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: '服务端错误'
      });
    }
    // console.log(data);
    if (data) {
      // email/nickname 已存在
      return res.status(200).json({
        err_code: 1,
        message: "email/nickname has already exist"
      })
    }
    // MD5加密密码
    body.password = md5(md5(body.password));

    // 不存在就保存 
    new User(body).save(function (err, user) {
      if (err) {
        return res.status(500).json({
          err_code: 500,
          message: 'Internet error'
        });
      }

      // 注册成功 使用session记录登录状态
      req.session.user = user;


      // express 提供的方法，json。接受一个对象为参数，自动转化成json字符串，再发送给浏览器
      // res.redirect('/');
      // 针对同步请求才有效 针对异步请求无效
      return res.status(200).json({
        err_code: 0,
        message: 'success'
      })
    })

    // 成功之后发送响应是 json 格式的 所以这里不是json格式 得不到数据
    // return res.status(200).send(JSON.stringify({
    //   success: true
    // }))

  })
})

router.get('/login', function (req, res) {
  res.render('login.html')
})

router.post('/login', function (req, res) {
  // res.render('index.html')
  // 1.请求
  // 1.处理 数据库查找数据
  // 2.响应 有 立即登录 没有提示无该账号
  // console.log(req.body);

  User.findOne({
    email: req.body.email,
    password: md5(md5(req.body.password))
  }, function (err, data) {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: err.message
      });
    }
    // db里没有用户信息
    if (!data) {
      return res.status(200).json({
        err_code: 1,
        message: "emial or nickname is invalid"
      })
    }
    // 存在 登录成功 记录状态
    req.session.user = data;
    // 此处异步请求无效哈 res.redirect('/')
    res.status(200).json({
      err_code: 0,
      message:'ok'
    })
  })
})

router.get('/logout', function (req, res) {
  // res.render('index.html')
  // 1.清chu登录状态
  // 2.重定向到登录页
  // a链接是同步请求 可以用服务端重定向
  req.session.user = null;
  res.redirect('/login');

})
module.exports = router