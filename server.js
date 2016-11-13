// Babel ES6/JSX Compiler
require('babel-register');
var swig  = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var routes = require('./app/routes');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var blockchain = require('./blockchain.js');

var node = express()
node.set('port', process.env.PORT || 3000);
node.set('view engine', 'html')
node.use(bodyParser.json())
node.use(bodyParser.urlencoded({ extended: false }));
node.use(logger('dev'));
node.use(express.static(path.join(__dirname, 'public')));

//blockchain(node);

node.use(function(req, res) {
    Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
        if (err) {
            res.status(500).send(err.message)
        } else if (redirectLocation) {
            res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
            var html = ReactDOM.renderToString(React.createElement(Router.RouterContext, renderProps));
            var page = swig.renderFile('views/index.html', { html: html });
            res.status(200).send(page);
        } else {
            res.status(404).send('Page Not Found')
        }
    });
});

node.listen(node.get('port'), function() {
    console.log('Express server listening on port ' + node.get('port'));
});