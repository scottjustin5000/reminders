var config = require('../../config');
var mongoClient = require('mongodb').MongoClient;
var Promise = require('Promise');

var dbSingleton = null;

var getConnection = function getConnection() {

    return new Promise(function(fulfill, reject) {
        if (dbSingleton) {
            fulfill(dbSingleton);
        } else {
            mongoClient.connect(config.mongoConnection, function(err, db) {
                if (err) {
                    console.log('error');
                    reject(err);
                } else {
                    dbSingleton = db;
                    fulfill(dbSingleton);
                }
            });
        }
    });
};

module.exports = getConnection;