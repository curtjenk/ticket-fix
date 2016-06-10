var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('./config');
var Q = require('q');
var Mailer = {};
Mailer.sendMail = function (whoFrom, to, subject, text, html) {
	var transporter = nodemailer.createTransport(smtpTransport(config.smtpConfig));
    //sendMail returns a promise if no callback is specified.
    return transporter.sendMail({
		from: whoFrom, // sender address
		to: to, // comma separated list of receivers
		subject: subject, // Subject line
		text: text, // plaintext body
		html: html // html body
	});
};

module.exports = Mailer;
