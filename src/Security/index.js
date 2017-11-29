'use strict'
require('dotenv').config()

const aes256 = require('nodejs-aes256');

const SECRET_KEY =  process.env.SECRET_KEY



exports.encrypt = (payload)=> {
    return aes256.encrypt(SECRET_KEY, JSON.stringify(payload));
} 


exports.decrypt = (key)=>{
    
    let response = aes256.decrypt(SECRET_KEY, key);

    return JSON.parse(response)
} 


