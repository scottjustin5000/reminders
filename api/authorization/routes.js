var authorizationManager = require('./authorizationManager');

function routes(app) {
    app.get('/api/init', function(req, res) {
        var id = req.query.id;
        if (id) {
            authorizationManager.authorization(id, res).then(function(d) {
                res.json(d);
            });
        } else {
            res.send('hello');
        }

    });

    app.get('/api/authorization/failure', function(req, res) {

        res.json({
            'message': 'auth err'
        });
    });

    app.get('/api/authorization/success', function(req, res) {

        res.json({
            'message': 'yer in!'
        });
    });


    app.get('/api/authorization/gaauthorize', function(req, res) {
        var code = req.query.code;

        if (code) {
            //need away to store this info other than in config
            var id = req.cookies.id;
            authorizationManager.googleAuthorization(code, id).then(function(data) {
                console.log('req received...');
                res.redirect('/api/authorization/success');
            });
        }

    });
}
module.exports = routes;