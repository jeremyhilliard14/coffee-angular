var express = require('express');
var router = express.Router();
var mongoUrl = 'mongodb://localhost:27017/coffee';
var mongoose = require('mongoose');
var Account = require('../models/accounts');
var bcrypt = require('bcrypt-nodejs');
var randtoken = require('rand-token');
mongoose.connect(mongoUrl);

//generate random token
var token = randtoken.generate(32);
//include stripe
var stripe = require("stripe")(
	"sk_test_f8WmD3UEdPs75vFvC5CJBzaQ"
);


router.post('/payments', function(req, res, next){
	stripe.charges.create({
	  amount: req.body.stripeAmount,
	  currency: "usd",
	  source: req.body.stripeToken, // obtained with Stripe.js
	  description: "Charge for " + req.body.stripeEmail
	}, {
	  idempotency_key: "XDvU538wJbtVou6x"
	}, function(err, charge) {
	  // asynchronously called
	});
})
//console.log(token);

router.get('/getUserData', function(req, res, next){
	console.log(req.query.token);
	if (req.query.token == undefined){
		res.json({failure: "noToken"});
	}else{
		//res.json({success: "tokenFound"});
		Account.findOne(
			{token: req.query.token},
			function(err, doc){
				if(doc == null){
					res.json({failure: "badToken"});
				}else{
					res.json(doc);
				}
			}
		);
	}
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// GET route for the register page
router.get('/register', function(req, res, next){
	res.render("register", {failure: req.query.failure})
});

//POST route for register
router.post('/register', function(req, res, next){
	//the user posted: username, email, password, password2
	if(req.body.password != req.body.password2){
		res.json({failure: 'passwordMatch'})
	}else{
		var token = randtoken.generate(32);
		console.log(token);
		var newAccount = new Account({
			username: req.body.username,
			password: bcrypt.hashSync(req.body.password),
			emailAddress: req.body.email,
			token: token
		});
		newAccount.save();
		//console.log(newAccount);
		//req.session.username = req.body.username;
		res.json({
			success: 'added',
			token: token
		});
		//res.render("register", {})
	}
});

router.get('/login', function(req, res, next){
	res.render("login", {page: 'login'});
});

router.post('/login', function(req, res, next){
	Account.findOne(
		{username: req.body.username},
		function(err, doc){
			if(doc == null){
				res.json({failure: 'noUser'});
			}else{
				console.log(doc);
				var loginResult = bcrypt.compareSync(req.body.password, doc.password);
				if(loginResult){
					//req.session.username = req.body.username;
					res.json({
						success: 'found',
						token: doc.token
					});
				}else{
					res.json({failure: 'badPassword'});
				} 
			}
		});
});

router.get('/options', function(req, res, next){
	if (!req.session.username){
		res.redirect('/login');
	}else{
		res.render('options', {username: req.session.username})
	}
});

router.post('/options', function(req, res, next){
	Account.findOneAndUpdate(
		{token: req.body.token}, //is the which
		{
			quantity: req.body.quantity,
			grind: req.body.grind.option,
			plan: req.body.plan,
			frequency: req.body.frequency.option,
			upsert: true
		},
		function(err, account){
			if(account == null){
				//no record that matched this token
				res.json({failure: 'noMatch'})
			}else{
				//we got a record and we updated it
				account.save();
				res.json({success: 'updated'})
			}
		}

	)
})

router.post('/delivery', function(req, res, next){
	Account.findOneAndUpdate(
		{token: req.body.token}, //is the which
		{
			fullName: req.body.fullName,
			address1: req.body.address1,
			address2: req.body.address2,
			city: req.body.city,
			state: req.body.state,
			zip: req.body.zipCode,
			deliveryDate: req.body.deliveryDate,
			upsert: true
		},
		function(err, account){
			if(account == null){
				//no record that matched this token
				res.json({failure: 'noMatch'})
			}else{
				//we got a record and we updated it
				account.save();
				res.json({success: 'updated'})
			}
		}

	)
})

module.exports = router;
