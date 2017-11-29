'use strict';

require('dotenv').config()

const mercadopago = require ('mercadopago');

const auth = require('./auth');

mercadopago.configure({
    sandbox: true,
    access_token : process.env.ACCESS_TOKEN_MP,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
})



const Cards = require('./Cards')
const Customers = require('./Customers')
const Payments = require('./Payments')


module.exports = function(server) {

	// Customers
	server.post('/MP/customers/create', auth.isSecure ,Customers.newCustomer);

	server.get('/MP/customers/:email', auth.isSecure ,Customers.getCustomer);

	server.put('/MP/customers/:id',auth.isSecure, Customers.updateCustomer);


	// Cards Methods
	server.post('/MP/customers/:client/cards/:token',auth.isSecure, Cards.linkCard);

	server.get('/MP/customers/:client/cards', auth.isSecure ,Cards.getCards);
	
	server.post('/MP/cards/create/token', auth.isSecure ,Cards.createToken);


	server.post('/MP/payment/create', auth.isSecure ,Payments.makePayment);



	server.post('/generate/token/admin', auth.createTokenApi);

};
