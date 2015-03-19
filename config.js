module.exports = function config() {

    var twilioConfiguration = {
        accountSid: 'AC5fee2039fbb579be826f9a082cd08acd',
        authToken: 'af93e9c73930095bf57eb34c6e1d8e46',
        number: '16505607552'
    };
    var googleConfiguration = {
        clientId: '296460139756-fji5vsurqg2os2a6869cefhunacnrvsj.apps.googleusercontent.com',
        clientSecret: 'wYad99_CnlyUgmBs-AmVwBdE',
        calendarId: 'scott@insight.ly',
        redirectUrl: 'http://localhost:3000/api/authorization/gaauthorize'
    };

    var mongoConnection = 'mongodb://testUser:nonClustered3003@linus.mongohq.com:10045/reminder';

    return {
        twilioConfiguration: twilioConfiguration,
        googleConfiguration: googleConfiguration,
        mongoConnection: mongoConnection
    }
}();