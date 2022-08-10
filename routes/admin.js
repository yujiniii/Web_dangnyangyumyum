/* 관리자 페이지 routes 처리 */
const express = require('express');
const db = require('../data/database')
const router = express.Router();
const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId;
const multer = require('multer');
const upload = multer({  //file처리 관련 부분
    storage:  multer.diskStorage({ 
        destination: (req,file,cb)=>{ 
            cb(null, 'images');
        },
        filename: (req,file,cb)=>{ 
            cb(null, new Date().valueOf()+"."+file.mimetype.split('/')[1]);
        }
    }),
});

router.get('/welcomeAdmin', function(req,res){
    res.render('admin/admin')
})


router.get('/salesManagement', async function(req,res,next){
    const allSales = await db.getDb().collection('items').find().toArray();
    res.render('admin/items',{items:allSales});
});

router.get('/salesManagement/:id/edit', async function(req,res){
    const thatItem = await db.getDb().collection('items').findOne({_id:new ObjectId(req.params.id)})
    res.render('admin/update-item',{item : thatItem});
});

router.post('/salesManagement/:id/edit', async function(req,res){
    let path; 
    if (typeof req.file === 'undefined') {
        console.log('message: "undefined image file(no req.file)"');
        path = ''
    } else {
        const type = req.file.mimetype.split('/')[1];
        if (type !== 'jpeg' && type !== 'jpg' && type !== 'png') {
            console.log('message: "Unsupported file type"');
        }
        path = req.file.path;
    }
    const aa = {
        name : req.body.name,
        price : req.body.price,
        detail : req.body.detail,
        type : req.body.type,
        image : path
    }
    console.log(aa);

    const result = await db.getDb().collection('items')
    .updateOne(
        {_id:new ObjectId(req.params.id)},
        {$set: {
            name : req.body.name,
            price : req.body.price,
            detail : req.body.detail,
            type : req.body.type,
            image : path
        }}
        );
    console.log(result);
    res.redirect('/salesManagement')

});

router.post('/salesManagement/:id/delete', async function(req,res){
    await db.getDb().collection('items').deleteOne({_id:new ObjectId(req.params.id)})
    res.redirect('/salesManagement');
});

router.get('/orderManagement', async function(req,res,next){
    const allOrders = await db.getDb().collection('orders').find().toArray();
    res.render('admin/orders', {orders:allOrders});
});

router.get('/newItem', function(req,res,next){
    const empty = {
        name : '',
        price:'3000',
        detail:''
    }
    res.render('admin/new-item',{item:empty});
});

router.post('/newItem' , upload.single('image'), async function(req,res,next){
    let path; 
    console.log("req.file : ",req.file)

    if (typeof req.file === 'undefined') {
        console.log('message: "undefined image file(no req.file)"');
        path = '';
    } else {
        const type = req.file.mimetype.split('/')[1];
        if (type !== 'jpeg' && type !== 'jpg' && type !== 'png') {
            console.log('message: "Unsupported file type"');
            path = '';
        }
        path = req.file.path;
    }
    console.log('path : ', path);
    const newItem = {
        name : req.body.name,
        price : req.body.price,
        detail : req.body.detail,
        type : req.body.type,
        image : path
    };

    console.log(newItem);

    await db.getDb().collection('items').insertOne(newItem);
    res.redirect('/salesManagement')

})

router.post('/fortype', async function(req,res){
    if(req.body.type === 'all'){
        res.redirect('/salesManagement')
    }
    const typeList = await db.getDb().collection('items').find({type:req.body.type}).toArray();
    res.render('admin/items',{items:typeList});
})

module.exports = router;