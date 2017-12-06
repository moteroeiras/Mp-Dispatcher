'use strict';

require('dotenv').config()

const master = require('../Security')

const mercadopago = require ('mercadopago');

const MP = new mercadopago(process.env.CLIENT_ID, process.env.CLIENT_SECRET)

exports.makePayment = function(data) {

    let defaultPayment = {
        statement_descriptor: 'FoodCloud',
        description: 'Compra',
        installments: 1,
        binary_mode: true,
        // application_fee : .10
    }

    let payload = Object.assign(defaultPayment, data)


    return MP.post('/v1/payments', payload)
};
