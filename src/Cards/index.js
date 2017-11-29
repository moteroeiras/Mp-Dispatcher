'use strict';

require('dotenv').config()

const mercadopago = require ('mercadopago');

const master = require('../Security');

exports.linkCard = function(req, res) {

    let { token, client } = req.params;

    mercadopago.post (`/v1/customers/${ client }/cards`, { token: token })

    .then((data)=>{
        res.send({ code: 200, data })
    },(error)=>{
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        res.send({ code: 500, error })
    });

};


exports.getCards = function(req, res) {

    let { client } = req.params;

    mercadopago.get (`/v1/customers/${ client }/cards`)

    .then((data)=>{
        res.send({ code: 200, data })
    },(error)=>{
        res.send({ code: 500, error })
    });

};


exports.createToken = function(req, res) {

    if(typeof(req.body.data) != 'string'){
        res.send({ code: 404, error: 'No hashed data' }); 
    }
    
    let payload = master.decrypt(req.body.data)

    mercadopago.post(`/v1/card_tokens`, payload)

    .then((data)=>{
        res.send({ code: 200, data : data.response })
    },(error)=>{
        console.log(error)
        res.send({ code: 500, error })
    });

};