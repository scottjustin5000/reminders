var Agenda = require("Agenda");
var calService = require('./calendar/calendarService.js');
var config = require('./../config.js');

modules.exports = function agendaFactory() {

    function createCalendarAgenda() {
        function setAgenda(oAuthClient, id) {
            var agenda = new Agenda({
                db: {
                    address: config.mongoConnection
                }
            });

            agenda.define('fetch events', function(job, done) {
                calService.fetchAndSchedule(id, oAuthClient);
                done();
            });

            agenda.every('10 minutes', 'fetch events');
            // Initialize the task scheduler
            agenda.start();
        }
    };

    return {
        createCalendarAgenda: createCalendarAgenda
    }
}();