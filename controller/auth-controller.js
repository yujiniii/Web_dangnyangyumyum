const bcrypt = require('bcryptjs');
const session = require('express-session');
const db = require('../data/database');


function getLogin(req, res, next) {
    sessionInputData = req.session.inputData;
    if (!sessionInputData) {
    sessionInputData = {
        hasError: false,
        email: '',
        confirmEmail: '',
        password: '',
        };
    }    
    req.session.inputData = null;
  
  res.render('sale/login',{inputData:sessionInputData});
}

const postLogin = async (req, res, next)=>{
    const enteredId = req.body.id;
    const enteredPassword = req.body.password;
    const existingUser = await db.getDb().collection('users').findOne({ id: enteredId });
    if (!existingUser) {
        req.session.inputData = {
          hasError: true,
          message: '사용자가 없습니다.',
          id: enteredId,
          password: enteredPassword,
        };
        req.session.save(function () {
            res.redirect('/login');
          });
          return;
        }
    
    const passwordsAreEqual = await bcrypt.compare(
        enteredPassword,
        existingUser.password
    );
    if (!passwordsAreEqual) {
        req.session.inputData = {
            hasError: true,
            message: '비밀번호를 확인해 주세요',
            id: enteredId,
            password: enteredPassword,
        };
        req.session.save(function () {
            res.redirect('/login');
            });
            return;
    }
    req.session.user = {id:existingUser._id, name:existingUser.name};
    req.session.isAdmin = existingUser.isAdmin;
    req.session.isAuthenticated = true;
    req.session.save(function(){
        res.redirect('/');
    });
}

function getSignup(req,res,next){
    let sessionInputData = req.session.inputData;
    if (!sessionInputData) {
    sessionInputData = {
        hasError: false,
        email: '',
        confirmEmail: '',
        password: '',
        };
    }    
    req.session.inputData = null;
  
  res.render('sale/signup',{inputData:sessionInputData});
}


async function postSignup (req,res,next){
    try{

        const enteredId = req.body.id;
        const enteredPassword = req.body.password;
        const enteredConfirmPassword = req.body.confirmPassword;

        const existingUser = await db.getDb().collection('users').findOne({ id: enteredId });
        if (existingUser) {
            req.session.inputData = {
              hasError: true,
              message: '같은 id가 존재합니다.',
              id: enteredId,
              password:enteredPassword,
              phone:req.body.phone,
              address : req.body.address,
            };
            req.session.save(function () {
                res.redirect('/signup');
              });
              return;
            }

        if (enteredPassword !== enteredConfirmPassword,
            enteredPassword.trim().length < 6){
                req.session.inputData = {
                    hasError: true,
                    id: enteredId,
                    message: '비밀번호를 확인해 주세요',
                    password:enteredPassword,
                    phone:req.body.phone,
                    address : req.body.address,
                    };   
                req.session.save(function(){
                    res.redirect('/signup');
                });
                return;
            }
        const hashPassword =  await bcrypt.hash(enteredPassword, 12);
      
        newUser = {
            id:enteredId,
            password: hashPassword,
            phone : req.body.phone,
            address : req.body.address,
            isAdmin:true
        }
        await db.getDb().collection('users').insertOne(newUser);
        res.redirect('/main');
    } catch(err){
        console.log(err);
    }
    
}

function postLogout (req,res,next){
    req.session.user = null;
    req.session.isAuthenticated = false;
    req.session.save(function(){
        res.redirect('/');
    });
} 
module.exports = {
    postLogin,
    getLogin,
    getSignup,
    postSignup,
    postLogout
}