/* 사용자 페이지 routes 처리 */
const express = require('express');
const db = require('../data/database')
const router = express.Router();
const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId;


router.get('/forDog', async function(req, res, next) {
  const dogList = await db.getDb().collection('items').find({type:'강아지용'}||{ type:'공용'}).toArray();
  res.render('sale/main',{items:dogList})
});
router.get('/forCat', async function(req, res, next) {
  const catList = await db.getDb().collection('items').find({type:'고양이용'}||{ type:'공용'}).toArray();
  res.render('sale/main',{items:catList})
});

router.get('/:id/detail', async function(req, res, next) {
  const thatItem = await db.getDb().collection('items').findOne({_id: new ObjectId(req.params.id)});
  res.render('sale/item-detail',{item:thatItem})
});

router.post('/:id/detail', async function(req, res, next) {
  const thatItem = await db.getDb().collection('items').findOne({_id: new ObjectId(req.params.id)});
  res.render('sale/item-detail',{item:thatItem})
});
module.exports = router;
