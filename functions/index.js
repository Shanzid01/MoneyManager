const functions = require('firebase-functions');
const express =require('express');
const bodyParser=require('body-parser');
const cors = require('cors');

//app setup
const app=express();
app.use(bodyParser.json());

//API route setup
const exchanges_route = require('./routes/api/exchanges');
app.use('/exchanges', cors({origin:true}), exchanges_route);

exports.api = functions.https.onRequest(app);
