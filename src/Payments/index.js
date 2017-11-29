'use strict';

require('dotenv').config()

const master = require('../Security')

const mercadopago = require ('mercadopago');


exports.makePayment = function(req, res) {

    if(typeof(req.body.data) != 'string'){
        res.send({ code: 404, error: 'No hashed data' }); 
    }

    let data = master.decrypt(req.body.data)

    let defaultPayment = {
        statement_descriptor: 'FoodCloud',
        description: 'Compra',
        installments: 1,
        "binary_mode": true
    }

    let payload = Object.assign(defaultPayment, data)

    mercadopago.payment.create(payload)
    .then(({ response })=>{
        res.send({ code: 200, data: response })
    },(error)=>{
        console.log(error)
        res.send({ code: error.status, error })
    });
};
