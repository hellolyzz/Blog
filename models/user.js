// 设计Schema 发布模型
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 链接数据库
mongoose.connect('mongodb://localhost/test');


var userSchema = new Schema({
  nickname: {
    require: true,
    type: String
  },
  password:{
    require: true,
    type: String
  },
  email:{
    type: String,
    require: true
  },
  createdTime:{
    type: Date,
    // 不要写Date.now()
    // 当new Model 时候没有传递creatTime，则mongoose会调用default中的Date.now方法，使用其值作为返回值
    default: Date.now
  },
  lastModifiedTime:{
    type: Date,
    default: Date.now
  },
  avatar:{ //头像
    type: String,
    default: '/public/img/avatat-max-img.png'
  },
  bio:{ //介绍
    type: String,
    default: ''
  },
  gender:{
    type: Number,
    enum: [-1,0,1],
    default: -1
  },
  birthday:{
    type: Date,
  },
  status:{ //是否可以评论
    type: Number,
    // 0 无限制
    // 1 不可以评论
    // 2 不可以登录
    enum: [0, 1, 2],
    default: 0 
  }
})

module.exports = mongoose.model('User',userSchema);