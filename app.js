const express = require('express');
const path = require('path');
const db = require('./data/database');
const session = require('express-session');
const mongodbS = require('connect-mongodb-session')
const MongodbStore = mongodbS(session);
const sessionStore = new MongodbStore({
  url:'localhost:27017',
  databaseName:'dangnyang',
  collection:"sessions"
});
const indexRouter = require('./routes/index');
const saleRouter = require('./routes/sale');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const fs = require('fs')

const app = express();

app.use('/images',express.static(path.join(__dirname,'images')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:'super',
  resave:false,   // true : 변경이 없어도 모든 세션 요청에 대해 저장
  saveUninitialized : false,
  store:sessionStore,
  cookie:{  // 만료 기한 설정, 생략시 브라우저가 종료되지 않는 이상은 만료되지 않음
    maxAge: 24 * 60 * 60 * 1000 // 하루
  }
}));


app.use(function(req,res,next){
  const user = req.session.user;
  const isAdmin = req.session.isAdmin
  if(!user || !isAdmin){
    return next();
  }
  res.locals.isAdmin = isAdmin;

  next();
})

app.use(function(req,res,next){
  const user = req.session.user;
  const isAuth = req.session.isAuthenticated
  if(!user || !isAuth){
    return next();
  }
  res.locals.isAuth = isAuth;

  next();
})


app.use(indexRouter);
app.use(authRouter);
app.use(saleRouter);
app.use(adminRouter);


/* error 처리 */
app.use(function (error, req, res, next) {
  console.log(error);
  res.status(500).render('errors/500');
});

app.use(function (error, req, res, next) {
  console.log(error);
  res.status(404).render('errors/404');
});



db.connectToDatabase().then(function () {
  app.listen(3000);
  console.log('server On...');
}).then(function(){
  const dir = './images';
  if (!fs.existsSync(dir)){fs.mkdirSync(dir);}
})

module.exports = app;
