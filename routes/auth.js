/* 회원가입, 로그인 관련 routes 처리 */
var express = require('express');
var router = express.Router();
const authController = require('../controller/auth-controller');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signup',authController.getSignup);

router.post('/signup', authController.postSignup);

router.post('/logout', authController.postLogout);

module.exports = router;