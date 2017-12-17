'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');
var bodyParser = require('body-parser');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	}

	var pollHandler = new PollHandler();

	app.route('/')
		.get(pollHandler.getAllPoll);

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/dashboard',
			failureRedirect: '/'
		}));
	
	app.route('/api/:id/polls')
		.get(isLoggedIn, pollHandler.getPolls)
		.post(isLoggedIn, bodyParser.urlencoded({extended: true}), pollHandler.addPoll)
		.delete(isLoggedIn, pollHandler.deletePoll);
	
	app.route('/poll/:pid')
		.get((req, res)=> {
			var obj =  req.isAuthenticated() ? req.user.github : false;
			res.render('vote', {'user': obj} );
		});
	
	app.route('/poll/:pid/getOne')
		.get(pollHandler.getOnePoll);
		
	app.route('/poll/:pid/vote')
		.post(bodyParser.urlencoded({extended: true}), pollHandler.vote);
		
	app.route('/dashboard')
		.get((req, res) => {
			if( !req.isAuthenticated())
				res.redirect('/');
			res.render('dashboard', {'user': req.user.github, 'edit': true});
		});
};
