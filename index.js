'use strict'
require('dotenv').config()

const express = require('express')
const fs = require('fs');
const bodyParser = require("body-parser");

const master = require('./src/Security')


const   app = express();
        app.use(bodyParser.json());

const PORT = process.env.PORT || 5000


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, mul");
  next();
});

app.get('/version',(req, res)=> res.send('1.0'));

app.get('/',(req, res)=> res.send('Hi there! your API is running'));

require('./src/routes')(app);

app.post('/encrypt', (req, res) =>{
  res.send(master.encrypt(req.body));
})

app.post('/desencrypt', (req, res) =>{
  res.send(master.decrypt(req.body.data));
})

app.listen(PORT, ()=>{
    console.log('====================================');
    console.log("App is running on: ", PORT);
    console.log('====================================');
})


// Expose app
exports = module.exports = app;


// rca
// diffie-helman