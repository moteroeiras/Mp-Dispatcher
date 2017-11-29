'use strict';

require('dotenv').config()

const mercadopago = require ('mercadopago');

// mercadopago.configure({
//     sandbox: true,
//     access_token : process.env.ACCESS_TOKEN_MP,
//     client_id: process.env.CLIENT_ID,
//     client_secret: process.env.CLIENT_SECRET,
// })

exports.newCustomer = function(req, res) {

    console.log(req.body)

    mercadopago.customers.create(req.body)

    .then((data)=>{
        res.send({ code: 200, data })
    },(error)=>{
        res.send({ code: 500, error })
    });

};


exports.getCustomer = function(req, res) {

    let { email } = req.params;

    mercadopago.get('/v1/customers/search', { 'email': email })

    .then((data)=>{
        res.send({ code: 200, data : data.response.results[0] })
    },(error)=>{
        res.send({ code: 500, error })
    });

};

exports.updateCustomer = function(req, res) {

    let { id } = req.params;

    mercadopago.put(`/v1/customers/${ id }`, req.body)

    .then((data)=>{
        res.send({ code: 200, data })
    },(error)=>{
        res.send({ code: 500, error })
    });

};

