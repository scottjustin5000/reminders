var authorizationManager = require('./authorizationManager');
var factory = require('../agendaFactory.js');

function routes(app) {
    app.get('/api/init', function(req, res) {
        var id = req.query.id;
        if (id) {
            authorizationManager.authorization(id, res).then(function(client) {
                if (client) {
                    factory.createAgenda(client, id);
                    res.send('fetching...');
                } else {
                    res.send('authorizing');
                }

            });
        } else {
            res.send('error: cal id required');
        }

    });

    app.get('/api/authorization/failure', function(req, res) {

        res.json({
            'message': 'auth err'
        });
    });

    app.get('/api/authorization/success', function(req, res) {

        res.json({
            'message': 'success'
        });


    });


    app.get('/api/authorization/gaauthorize', function(req, res) {
        var code = req.query.code;

        if (code) {
            //need away to store this info other than in config
            var id = req.cookies.id;
            authorizationManager.googleAuthorization(code, id).then(function(data) {
                if (data) {
                    factory.createAgenda(data, id);
                    res.redirect('/api/authorization/success');
                } else {
                    res.redirect('/api/authorization/failure');
                }

            });
        }

    });
}
module.exports = routes;