const CardsCrl = require('./')


exports.pay = function(req, res) {
	
	CardsCrl.pay(req).then(function(data) {
        res.status(200).send(data)
	}, function({ code, data }) {
        console.log('==================ER==================');
        console.log({ code, data });
        console.log('====================================');
        // res.status(501).send(data)
        res.send({ code, data })
	});
};