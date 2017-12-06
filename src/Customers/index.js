'use strict';

require('dotenv').config()

const mercadopago = require ('mercadopago');

const MP = new mercadopago(process.env.CLIENT_ID, process.env.CLIENT_SECRET)

exports.newCustomer = function(req, res) {

    let data = Object.assign(req.body, { email: `${ req.body.email }.foodcloud.io` })

    MP.post('/v1/customers/', data)
    .then((data)=>{

        console.log(data)

        res.send({ code: 200, data })



    },(error)=>{
        res.send({ code: error.cause[0].code, error : error.cause[0].description })
    });

};


exports.getCustomer = function(req, res) {

    let { email } = req.params;

    MP.get('/v1/customers/search', { email : `${ email }.foodcloud.io` })
    .then((data)=>{
        console.log('===============DATA=====================');
        console.log(data);
        console.log('====================================');

        res.send({ code: 200, data : data.response.results[0] })

    },(error) =>{
        console.log('===============ERROR=====================');
        console.log(error);
        console.log('====================================');
        res.send({ code: 500, error })
    })

};

exports.updateCustomer = function(req, res) {

    let { id } = req.params;

    let data = Object.assign(req.body, { email: `${ req.body.email }.foodcloud.io` })

    MP.put(`/v1/customers/${ id }`, data)

    .then((data)=>{
        res.send({ code: 200, data })
    },(error)=>{
        res.send({ code: 500, error })
    });

};

exports.deleteCustomer = function(req, res) {

    let { client } = req.params;

    MP.delete(`/v1/customers/${ client }`)
    .then((data)=>{
        res.send({ code: 200, data })
    },(error)=>{
        res.send({ code: 500, error })
    });

};