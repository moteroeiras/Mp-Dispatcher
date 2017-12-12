'use strict';

require('dotenv').config()

const mercadopago = require ('mercadopago');

const MP = new mercadopago(process.env.ACCESS_TOKEN_MP)

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


exports.getToken = function(req, res) {

    let { code } = req.params;


    MP.post('/oauth/token', {
      client_secret : process.env.ACCESS_TOKEN_MP,
      grant_type : "authorization_code",
      code,
      redirect_uri :  "http://localhost:8000/mercado-pago/token"
    })
    .then((data)=>{
        console.log('===============DATA=====================');
        console.log(data);
        console.log('====================================');

        res.send({ code: 200, data : data.response })

    },(error) =>{
        console.log('===============ERROR=====================');
        console.log(error);
        console.log('====================================');
        res.send({ code: 500, error })
    })

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

    MP.put(`/v1/customers/${ id }`, data )
    .then((data)=>{
        console.log(data);
        res.send({ code: 200, data })
    },(error)=>{
        console.log(error);
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
