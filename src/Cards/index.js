'use strict';

require('dotenv').config()

const mercadopago = require ('mercadopago');

const payments = require('../Payments')

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

exports.deleteCards = function(req, res) {

    let { client, card } = req.params;

    mercadopago.delete(`/v1/customers/${ client }/cards/${ card }`)

    .then((data)=>{
        res.send({ code: 200, data })
    },(error)=>{
        res.send({ code: 500, error })
    });

};

const tokenCard = (payload) =>{
    return mercadopago.post(`/v1/card_tokens`, payload)
}


exports.pay = function(req, res) {
    let card_id = Object.keys(req.body.card)[0]
    let payload = {
        card_id,
        security_code : master.decrypt(req.body.card[card_id])
    }

    tokenCard(payload)
    .then((data) => {
        let {response} = data
        console.log(data)
        console.log('Token generated sucessful')

        let { order } = req.body;
        let transaction_amount = 0

        order.products.map((item) =>{
            transaction_amount = transaction_amount + item.finalPrice
        })

        let { customer_id, customer_email, payment_method } = order.paymentMethod.data;

        let trans = {
            transaction_amount,
            token : response.id,
            payment_method_id : payment_method,
            payer : {
                "email": customer_email,
                "id" : customer_id
            }
        }

        console.log('============DATA========================');
        console.log(order);
        console.log('====================================');

        payments.makePayment(trans)
        .then((result) =>{
            let { response } = result
            let payload = {
                id: response.id,
                collector: '',
                user_id : response.payer.id,
                card : {
                    payment_method : response.payment_method_id,
                    payment_type : response.payment_type_id,
                    id: response.card.id,
                    last_four_digits : response.card.last_four_digits
                },
                fee_details:  response.fee_details
            }
            res.send({ code: 200, data : payload })
        }).catch(err =>{
            res.send({ code : err.status, data: err.message })
            console.log('==============ERROR======================');
            console.log(err);
            console.log('====================================');
        })
        
    })
    .catch(err => console.log(err))
}

exports.createToken = function(req, res) {

    if(typeof(req.body.data) != 'string'){
        res.send({ code: 404, error: 'No hashed data' }); 
    }

    let payload = master.decrypt(req.body.data)

    let { userID } = req.params;

    mercadopago.post(`/v1/card_tokens`, payload)

    .then((data)=>{

        if(userID) {
            mercadopago.post (`/v1/customers/${ userID }/cards`, { token: data.response.id })
            
            .then((result)=>{
                res.send({ code: 200, data : result })
            },(error)=>{
                console.log('====================================');
                console.log(error);
                console.log('====================================');
                res.send({ code: 500, error })
            });
        }

    // res.send({ code: 200, data : data })

    },(error)=>{
        console.log(error)
        res.send({ code: 500, error })
    });

};