var mongoClient = require('mongodb').MongoClient;
var Promise = require('promise');
var getConnection = require('./connection');

function mongoRepository(object) {

    var objectName = object;

    var add = function(value) {
        return new Promise(function(fulfill, reject) {
            getConnection().then(function(db) {
                var col = db.collection(objectName);

                col.insert(value, function(err, doc) {
                    if (err) {
                        console.log(err);
                    }
                    fulfill(doc);
                });
            });
        });
    };

    var findById = function(id) {

        return new Promise(function(fulfill, reject) {

            getConnection().then(function(db) {

                var ObjectID = db.bson_serializer.ObjectID;
                var col = db.collection(objectName);
                col.findOne({
                    _id: ObjectID(id)
                }, function(err, doc) {
                    if (!err) {
                        fulfill(doc);
                    } else {
                        reject(err);
                    }

                });
            });
        });
    };

    var findSingle = function(specification) {
        return new Promise(function(fulfill, reject) {
            console.log(getConnection);
            getConnection().then(function(db) {
                var col = db.collection(objectName);

                col.findOne(specification, function(err, doc) {
                    if (!err) {
                        fulfill(doc);
                    } else {
                        console.log(err);
                        reject(err);
                    }
                });
            })
        });
    };

    var find = function(specification) {

        return new Promise(function(fulfill, reject) {
            getConnection().then(function(db) {

                var col = db.collection(objectName);

                col.find(specification).toArray(function(err, doc) {
                    if (!err) {
                        fulfill(doc);
                    } else {
                        reject(err);
                    }

                });
            })
        });

    };
    var findAndModify = function(id, value) {
        return new Promise(function(fulfill, reject) {
            getConnection().then(function(db) {
                //if (!err) {
                // var ObjectID = db.bson_serializer.ObjectID;
                var col = db.collection(objectName);
                col.findAndModify({
                        _id: id //ObjectID(id)
                    }, [
                        ['_id', 'asc']
                    ], {
                        $set: value
                    }, {
                        w: 0
                    },
                    function(err, object) {
                        if (!err) {
                            console.log(object);
                            fulfill(object);
                        } else {
                            console.log(err);
                            reject(err);
                        }
                    });
                //} else {
                //    reject(err);
                //}
            });
        });
    };

    var remove = function(id) {
        getConnection().then(function(db, err) {

            db.collection(objectName);
            var ObjectId = db.bson_serializer.ObjectID;
            col.remove({
                _id: ObjectID(id)
            }, function(err, result) {
                if (err) {
                    console.log(err);
                }

            });
        });
    };
    return {
        add: add,
        find: find,
        findSingle: findSingle,
        findAndModify: findAndModify
    }
}
module.exports = mongoRepository;