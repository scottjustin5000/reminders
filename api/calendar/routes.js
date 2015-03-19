var authorizationManager = require('./authorizationManager');

function routes(app) {
    app.get('/', function(req, res) {

        var id = req.query.id;
        console.log(id);
        if (id) {
            authorizationManager.authorization(id).then(function(d) {
                console.log(d);
                res.json(d);
            });
        } else {
            res.send('hello');
        }

    });

    app.get('api/authorization/failure', function(req, res) {

        res.json({
            'message': 'auth err'
        });
    })


    app.get('/api/authorization/gaauthorize', function(req, res) {
        var code = req.query.code;

        if (code) {
            authorizationManager.googleAuthorization(code, function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/');
                }
            });
        }

    });
}
module.exports = routes;