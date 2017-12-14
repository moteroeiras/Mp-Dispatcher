'use strict';

require('dotenv').config()

const master = require('../Security')

const mercadopago = require ('mercadopago');

const MP = new mercadopago(process.env.ACCESS_TOKEN_MP)

var Q = require('q');

exports.makePayment = function(data) {
    return Q.Promise(function(resolve, reject) {
        let { receptor } = data

        delete data.receptor

        let defaultPayment = {
            statement_descriptor: 'FoodCloud',
            description: 'Compra',
            installments: 1,
            binary_mode: true,
            application_fee : Number((data.transaction_amount * .07).toFixed(2))
        }

        let payload = Object.assign(defaultPayment, data)

        console.log('==============Trans======================');
        console.log(payload);
        console.log('====================================');

        const MPReceptor = new mercadopago(receptor.access_token)

        MPReceptor.post('/v1/payments', payload).then(response => resolve(response), err => reject(err))

    })
};
