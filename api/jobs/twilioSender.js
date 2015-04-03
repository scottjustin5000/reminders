var config = require('../../config.js');
var twilio = require('twilio');
var smsSend = function() {
    var client = new twilio.RestClient(config.twilioConfiguration.accountSid, config.twilioConfiguration.authToken);

    function sendSms(agenda, event, task, number) {
        agenda.define(task, function(job, done) {
            client.sendSms({
                to: number,
                from: config.twilioConfiguration.number,
                body: 'Your call (' + event.eventName + ') will start in 5 minutes. Make sure you\'re in a quiet place'
            }, function(error, message) {
                if (!error) {
                    console.log('Success! The SID for this SMS message is:');
                    console.log(message.sid);
                    console.log('Message sent on:');
                    console.log(message.dateCreated);
                    console.log(message.to);
                } else {
                    console.log(error);
                    console.log('Oops! There was an error.');
                }
            });
            done();
        });
        agenda.create(task).schedule(event.smsTime).unique({
            'id': event.id
        }).save();
    };

    function sendCall(agenda, event, task, number) {
        agenda.define(task, function(job, done) {
            // Place a phone call, and respond with TwiML instructions from the given URL
            client.makeCall({

                to: number, // Any number Twilio can call
                from: config.twilioConfiguration.number, // A number you bought from Twilio and can use for outbound communication
                url: 'http://5bd4e644.ngrok.com/api/calendar/call/?number=' + event.number + '&eventName=' + encodeURIComponent(event.eventName) // A URL that produces an XML document (TwiML) which contains instructions for the call

            }, function(err, responseData) {
                if (err) {
                    console.log(err);
                } else {
                    // executed when the call has been initiated.
                    console.log(responseData.from);
                }
            });
            done();
        });
        agenda.create(task).schedule(event.eventTime).unique({
            'id': event.id
        }).save();
    }

    return {
        sendSms: sendSms,
        sendCall: sendCall
    }
};