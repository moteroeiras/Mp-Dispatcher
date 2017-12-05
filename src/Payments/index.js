'use strict';

require('dotenv').config()

const master = require('../Security')

const mercadopago = require ('mercadopago');


exports.makePayment = function(data) {

    let defaultPayment = {
        statement_descriptor: 'FoodCloud',
        description: 'Compra',
        installments: 1,
        binary_mode: true,
        // application_fee : .10
    }

    let payload = Object.assign(defaultPayment, data)

    console.log('================PAYLAOD====================');
    console.log(payload);
    console.log('====================================');

    return mercadopago.payment.create(payload)
};
