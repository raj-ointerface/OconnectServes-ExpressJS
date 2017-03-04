/**
 * Created by arun on 4/3/17.
 */


var mongoose = require('mongoose');
var error = require('../utils/Error');
var success = require('../utils/Success');
var config = require('../config');

module.exports = self = {};

self.deleteAttendee = function (id,callBack) {
    mongoose.connection.db.collection(config.attendeeCollection, function (err, collection) {
        if(err){
            callBack(error.internalError(err));
        }
        else
        {
            collection.update({_id : id},{isDeleted : true},{upsert : true},function (updateError,updateData) {
                if(updateError){
                    callBack(error.internalError(updateError));
                }
                else
                {
                    callBack(success.successTrue());
                }
            });
        }
    });
};