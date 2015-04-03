var agenda = require('Agenda');
var Promise = require('Promise');
var config = require('../../config.js');
var gapi = require('googleapis');
var twilioSender = require('../jobs/twilioSender.js');
var repository = require('../data/mongoRepository.js');

module.exports = function calendarService() {
    var calendar = gapi.calendar('v3');

    function fetchAndSchedule(calendarId, oAuthClient) {
        // Set obj variables
        var id;
        var eventName;
        var number;
        var start;
        // Call google to fetch events for today on our calendar
        calendar.events.list({

            calendarId: calendarId,
            maxResults: 20,
            timeMax: Date.parse('tomorrow').addSeconds(-1).toISOString(), // any entries until the end of today
            updatedMin: new Date().clearTime().toISOString(), // that have been created today
            auth: oAuthClient
        }, function(err, events) {
            if (err) {
                console.log('Error fetching events');
                console.log(err);
            } else {
                // Send our JSON response back to the browser
                console.log('Successfully fetched events');

                for (var i = 0; i < events.items.length; i++) {
                    // populate CalendarEvent object with the event info
                    event = new CalendarEvent(events.items[i].id, events.items[i].summary, events.items[i].location, events.items[i].start.dateTime);

                    // Filter results 
                    // ones with telephone numbers in them 
                    // that are happening in the future (current time < event time)
                    if (event.number.match(/\+[0-9 ]+/) && (Date.compare(Date.today().setTimeToNow(), Date.parse(event.eventTime)) == -1)) {

                        // SMS Job
                        twilio.sendSms(jobSchedule.agenda, event, 'sms#1', config.ownNumber);

                        // Call Job
                        twilio.sendCall(jobSchedule.agenda, event, "call#1", config.ownNumber);
                    }
                }

            }
        });
    }


    return {
        fetchAndSchedule: fetchAndSchedule
    }

}()