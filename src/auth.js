'use strict'

require('dotenv').config()

const aes256 = require('nodejs-aes256');

const SECRET = process.env.AUTH_TOKEN;

exports.createTokenApi = (req, res)=> {
    res.send({ code: 200, token: aes256.encrypt(SECRET, 'FoodcloudPayments') })
} 

exports.isSecure = (req, res, next)=>{

    var token = req.query.token || req.headers['x-access-token'];

    if (token) {
    

        let response = aes256.decrypt(SECRET, token);

        console.log(response)

        if(response == 'FoodcloudPayments') {
            next();
        }
        else {
            res.status(403).send({
                success: false,
                message: 'Invalid Signature'
            });
        }

    }
    else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }

} 

