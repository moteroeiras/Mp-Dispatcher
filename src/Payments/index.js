'use strict';

require('dotenv').config()

const master = require('../Security')

const mercadopago = require ('mercadopago');

const MP = new mercadopago(process.env.ACCESS_TOKEN_MP)

var Q = require('q');

exports.makePayment = function(data) {
    return Q.Promise(function(resolve, reject) {
        let { receptor } = data

        const freeTax = {
            '147179141' : true, //Elenorrs
            '272370948' : true, //coffe town Bolivar y libertad
            '270892743' : true, //D'oro
            '154697480' : true, //Vidana
            '52204490' : true, //Directo de huerta
            '196220748' : true, //Brindisi
            '104266541' : true, //Brixton
            '26044625' : true, //Posta de Cafe
            '250790253' : true, //Tuo Tempo
            '233273833' : true, //Come reza ama
            '81620630' : true, //Rooster
            '274110247' : true, //360 Bar
        
            // '274110247' : true, //All that Food 
        }

        delete data.receptor

        let defaultPayment = {
            statement_descriptor: 'FoodCloud',
            description: 'Compra',
            installments: 1,
            binary_mode: true
            // application_fee : Number((data.transaction_amount * .07).toFixed(2))
        }

        if(!freeTax[receptor.user_id]){
            console.log('====================================');
            console.log("Pay with no Fee");
            console.log('====================================');
            defaultPayment = Object.assign({}, defaultPayment, {
                "application_fee" : Number((data.transaction_amount * .07).toFixed(2))
            });
        }

        let payload = Object.assign(defaultPayment, data)

        console.log('==============Trans======================');
        console.log(payload);
        console.log('====================================');

        const MPReceptor = new mercadopago(receptor.access_token)

        MPReceptor.post('/v1/payments', payload).then(response => resolve(response), err => reject(err))

    })
};
