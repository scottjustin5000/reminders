var Promise = require('Promise');
var config = require('../../config.js');
var date = require('datejs');
var gapi = require('googleapis');
var repository = require('../data/mongoRepository.js');

module.exports = function authorizationManager() {
    var tokenRepository = new repository('tokens');
    var oAuthClient = new gapi.auth.OAuth2(config.googleConfiguration.clientId,
        config.googleConfiguration.clientSecret, config.googleConfiguration.redirectUrl);

    function authorization(id, res) {
        return new Promise(function(fulfill, reject) {

            tokenRepository.findSingle({
                    '_id': id
                })
                .then(function(userTokens) {
                    //test if expired, or not
                    if (userTokens) {
                        try {
                            if (Date.compare(Date.today().setTimeToNow(), Date.parse(userTokens.expires_at)) == -1) {
                                setCredentials(userTokens.access_token, userTokens.refresh_token);
                                setAgenda(oAuthClient);
                            } else {
                                setCredentials(userTokens.access_token, userTokens.refresh_token, oAuthClient);
                                refreshToken(id, userTokens.refresh_token).then(function(tokens) {
                                    setAgenda(oAuthClient);
                                    fulfill(oAuthClient);

                                });
                            }
                        } catch (err) {
                            console.log(err);
                            reject(err);
                        }

                    } else {
                        res.cookie('id', id, {
                            maxAge: 900000,
                            httpOnly: true
                        });
                        requestToken(res);
                        fulfill('');
                    }

                });
        });
    };

    function googleAuthorization(code, id) {

        return new Promise(function(fulfill, reject) {
            oAuthClient.getToken(code, function(err, tokens) {
                if (err) {
                    console.log('Error authenticating');
                    console.log(err);
                    reject(err);
                } else {
                    storeToken(id, tokens).then(function(doc) {
                        setCredentials(tokens.access_token, tokens.refresh_token);
                        fulfill(oAuthClient);
                    });
                }
            });
        });
    };

    // Refreshes the tokens and gives a new access token
    function refreshToken(id, refresh_token) {
        return new Promise(function(fulfill, reject) {
            oAuthClient.refreshAccessToken(function(err, tokens) {
                if (err) {
                    reject(err);
                }
                updateToken(id, tokens).then(function() {
                    fulfill(tokens);
                });

            });
            console.log('access token refreshed');

        });

    };

    function setCredentials(access_token, refresh_token) {
        oAuthClient.setCredentials({
            access_token: access_token,
            refresh_token: refresh_token
        });
    };

    function requestToken(res) {
        // Generate an OAuth URL and redirect there
        var url = oAuthClient.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/calendar.readonly'
        });
        res.redirect(url);
    };

    function storeToken(id, token) {
        return new Promise(function(fulfill, reject) {
            var settings = {};
            settings._id = id;
            settings.access_token = token.access_token;
            settings.expires_at = new Date(token.expiry_date);
            settings.refresh_token = token.refresh_token;
            tokenRepository.add(settings).then(function(doc) {
                fulfill(doc);
            });
        });
    };

    function updateToken(id, token) {
        return new Promise(function(fulfill, reject) {
            tokenRepository.findAndModify(id, {
                access_token: token.access_token,
                expires_at: new Date(token.expiry_date)
            }).then(function() {
                fulfill(token);
            });
        });
    };

    return {
        authorization: authorization,
        googleAuthorization: googleAuthorization
    }
}();