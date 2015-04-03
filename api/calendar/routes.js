var twilio = require('twilio');

function routes(app) {
    app.get('/api/calendar/call', function(req, res) {
        var number = req.query.number;
        var eventName = req.query.eventName;
        var resp = new twilio.TwimlResponse();
        resp.say('Your meeting ' + eventName + ' is starting.', {
            voice: 'alice',
            language: 'en-gb'
        }).dial(number);

        res.writeHead(200, {
            'Content-Type': 'text/xml'
        });
        res.end(resp.toString());

    });
}
module.exports = routes;