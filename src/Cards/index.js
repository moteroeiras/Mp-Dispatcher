'use strict';

require('dotenv').config()

const mercadopago = require ('mercadopago');

const payments = require('../Payments')

const master = require('../Security');

var Q = require('q');

const MP = new mercadopago(process.env.ACCESS_TOKEN_MP)

exports.linkCard = function(req, res) {

    let { token, client } = req.params;

    MP.post (`/v1/customers/${ client }/cards`, { token: token })

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

    MP.get (`/v1/customers/${ client }/cards`)

    .then((data)=>{
        res.send({ code: 200, data })
    },(error)=>{
        res.send({ code: 500, error })
    });

};

exports.deleteCards = function(req, res) {

    let { client, card } = req.params;

    MP.delete(`/v1/customers/${ client }/cards/${ card }`)

    .then((data)=>{
        res.send({ code: 200, data })
    },(error)=>{
        res.send({ code: 500, error })
    });

};

const tokenCard = (payload) =>{
    return Q.Promise((resolve, reject) => {
        MP.post(`/v1/card_tokens`, payload).then(response => resolve(response), err => reject(err))
    })
}


exports.pay = function(req, res) {
    return Q.Promise((resolve, reject) => {

        let card_id = Object.keys(req.body.card)[0]
        let payload = {
            card_id,
            security_code : master.decrypt(req.body.card[card_id])
        }

        // console.log({ code: master.decrypt(req.body.card[card_id]) });

        tokenCard(payload)
        .then((data) => {
            let {response} = data

            let { order } = req.body;
            let { commerce } = order.subsidiary


            if (!commerce.mercadopago) reject({ code: 404, data: 'mercadopago not found' })

            let transaction_amount = 0

            order.products.map((item) =>{
                transaction_amount = transaction_amount + item.finalPrice
            })

            let { customer_id, customer_email, payment_method } = order.paymentMethod.data;

            let receptor = commerce.mercadopago

            let trans = {
                transaction_amount,
                token : response.id,
                payment_method_id : payment_method,
                description: `Compra en ${ commerce.name }`,
                receptor,
                payer : {
                    "email": customer_email,
                    "id" : customer_id
                }
            }

            console.log('====================================');
            console.log("PAYMENT STARTED");
            console.log('====================================');


            payments.makePayment(trans)

            .then((result) =>{

                let { response } = result

                console.log('================DATA===================');
                console.log(response);
                console.log('====================================');

                if(response.status == 'rejected'){
                    let text = `La tarjeta terminada en ${ response.card.last_four_digits } ha sido rechazada\n${ response.status_detail === 'cc_rejected_call_for_authorize' ? 'Llamar al emisor para autorizar la compra' : '' }${ response.status_detail === 'cc_rejected_bad_filled_security_code' ? 'Código de seguridad incorrecto' : '' }`
                    return reject({ code: 403, data: text })
                }
                
                let payloadResult = {
                    id: response.id,
                    user_id : customer_id,
                    card : {
                        payment_method : response.payment_method_id,
                        payment_type : response.payment_type_id,
                        id: response.card.id,
                        last_four_digits : response.card.last_four_digits
                    },
                    fee_details:  response.fee_details
                }
        
                resolve(payloadResult)

            })
            .catch(err => reject({ code : err.status, data : `${ err.name } - ${ err.message }` }))
        })
        .catch(err => reject(err))
    })
}

exports.createToken = function(req, res) {

    if(typeof(req.body.data) != 'string'){
        res.send({ code: 404, error: 'No hashed data' });
    }

    let payload = master.decrypt(req.body.data)

    let { userID } = req.params;

    MP.post(`/v1/card_tokens`, payload)

    .then((data)=>{


        if(userID) {
            MP.post (`/v1/customers/${ userID }/cards`, { token: data.response.id })

            .then((result)=>{
                res.send({ code: 200, data : result })
                console.log('================DATA====================');
                console.log(result);
                console.log('====================================');
            },(err)=>{
                console.log('==================ERR==================');
                console.log(err);
                console.log('====================================');
                res.send({ code: 500, err })
                // throw err
            });
        }

    // res.send({ code: 200, data : data })

  },(err)=>{
        console.log(err)
        res.send({ code: 500, err })
    });

};
