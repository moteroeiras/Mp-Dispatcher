'use strict'
require('dotenv').config()

const SECRET_KEY =  process.env.SECRET_KEY

var CryptoJS = require("crypto-js");


exports.encrypt = (text)=> {
    // return aes256.encrypt(SECRET_KEY, JSON.stringify(payload));

    // var cipher = crypto.createCipheriv(algorithm, SECRET_KEY, "BCFE7")
    // var encrypted = cipher.update(text, 'utf8', 'hex')

    // encrypted += cipher.final('hex');

    // return encrypted
} 


exports.decrypt = (encrypted)=>{
    
    let bytes  = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    let plaintext = bytes.toString(CryptoJS.enc.Utf8);

    let data = JSON.parse(plaintext)

    return data
} 


