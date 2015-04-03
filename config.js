module.exports = function config() {

    var twilioConfiguration = {
        accountSid: '',
        authToken: '',
        number: ''
    };
    var googleConfiguration = {
        clientId: '',
        clientSecret: '',
        redirectUrl: ''
    };

    var mongoConnection = '';

    return {
        twilioConfiguration: twilioConfiguration,
        googleConfiguration: googleConfiguration,
        mongoConnection: mongoConnection
    }
}();