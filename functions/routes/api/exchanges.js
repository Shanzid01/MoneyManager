const express = require('express');
const router = express.Router();
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("../../keys/moneymanager-664f7-firebase-adminsdk-2jhzv-a2dae7858e.json");
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://moneymanager-664f7.firebaseio.com"
});

//server-side authentication
const FbAuth = (req, res, next) =>{
    res.set('Author', 'Shanzid Shaiham');
    res.set('Author-site', 'https://shanzid.com');
    let idToken;
    let tokenHeader=req.headers.usertoken;
    if(tokenHeader && tokenHeader.length>0){
        res.set('Access-Control-Allow-Origin', '*');
        idToken=tokenHeader;
        firebaseAdmin.auth().verifyIdToken(idToken)
            .then(user=>{
                req.user=user;
                return next();
            }).catch(()=>{
                return res.status(403).json({error:'UNAUTHORIZED REQUEST'});
            });
    }else{
        return res.status(403).json({error:'UNAUTHORIZED REQUEST'});
    }
}
router.use(FbAuth);

//Initialize DB
let firestore = firebaseAdmin.firestore();


/*********------------Routes------------******** */


// @route   GET api/exchanges
// @desc    Get all exchanges
// @access  Public
router.get('/', (req, res)=>{
    let account=req.query.account;
    if(!account){
        account='Cash';
    }
    firestore.collection('Exchanges')
        .where('user_id','==',req.user.uid)
        .where('account','==',account)
        .get()
        .then((snapshot) => {
            let allData=[];
            snapshot.forEach((doc) => {
                let data=doc.data();
                data["_id"]=doc.id;
                allData.push(data);
            });
            res.json(allData);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});

// @route   GET api/exchanges/accounts
// @desc    Get distinct account names
// @access  Public
router.get('/accounts/', (req, res)=>{
    firestore.collection('Exchanges')
        .where('user_id','==',req.user.uid)
        .get()
        .then((snapshot) => {
            let allAccounts=[];
            snapshot.forEach((doc) => {
                allAccounts.push(doc.data());
            });
            let unique = [...new Set(allAccounts.map(item => item.account))];
            if(unique.length===0){
                unique.push('Cash');
            }
            res.json(unique);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});


// @route   GET api/exchanges/categories
// @desc    Get distinct categories
// @access  Public
router.get('/categories/', (req, res)=>{
    firestore.collection('Exchanges')
        .where('user_id','==',req.user.uid)
        .get()
        .then((snapshot) => {
            let allCategories=[];
            snapshot.forEach((doc) => {
                allCategories.push(doc.data());
            });
            let unique = [...new Set(allCategories.map(item => item.category))];
            res.json(unique);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});


// @route   POST api/exchanges
// @desc    POST an exchange
// @access  Public
router.post('/', (req, res)=>{
    let exchangeName = req.body.name;
    let exchangeAmount = req.body.amount;
    if(!exchangeName || !exchangeAmount){
        res.json({'status':0});
    }else{
        let newDocument={
            user_id: req.user.uid,
            name: exchangeName,
            amount: exchangeAmount,
            type: req.body.type,
            details: req.body.details,
            category: req.body.category? req.body.category:'Uncategorized',
            date: req.body.date? req.body.date:Date.now,
            account: req.body.account? req.body.account:'Cash'
        }
        firestore.collection('Exchanges').add(newDocument)
            .then(document => {
                console.log(document);
                firestore.collection('Exchanges').doc(document.id)
                .get()
                .then(doc=>{
                    res.json(doc.data());
                })
            }).catch(error=>{
                res.status(400).json(error);
            })
    }
});


// @route   DELETE api/exchanges/:id
// @desc    DELETE an exchange
// @access  Public
router.delete('/',(req, res)=>{
    let exchangeID=req.query.id;
    if(!exchangeID){
        res.json({'status':0});
    }else{
        firestore.collection('Exchanges')
        .where('user_id','==',req.user.uid)
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                if(doc.id===exchangeID){
                    doc.ref.delete();
                }
            });
            res.json({'status':1});
        })
        .catch(err=>{
            res.status(400).json({'status':0, 'message':err});
        });
    }
});

module.exports = router;