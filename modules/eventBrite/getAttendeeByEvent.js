/**
 * Created by arun
 */

var unirest = require('unirest');
var mongoose = require('mongoose');
var error = require('../utils/Error');
var success = require('../utils/Success');
var config = require('../config');
var Api = require('../utils/CallApi');
var Attendee = require('../../models/eventBriteAttendees');


var self = module.exports = {};

self.updateAttendeeCollectionByEvent = function (id, callBack) {

    mongoose.connection.db.collection(config.conferenceCollection, function (err, collection) {

        var query = {_id: id};

        if (err) {
            callBack(error.internalError(err));
        }
        else {
            collection.findOne(query, function (conferenceError, conferenceData) {

                if (conferenceError) {
                    callBack(error.internalError(conferenceError));
                }
                else {
                    if (conferenceData.eventbriteId == undefined ||
                        conferenceData.eventbriteId == null ||
                        conferenceData.eventbriteId == '' ||
                        conferenceData.eventbriteToken == undefined ||
                        conferenceData.eventbriteToken == null ||
                        conferenceData.eventbriteToken == ''
                    ) {
                        console.log("error");
                        callBack(error.error('EventBrite Details Not Updated, Please check', 403))
                    }
                    else {
                        // callBack(success.success(conferenceData));
                        var api = new Api();
                        api.url = 'https://www.eventbriteapi.com/v3/events/' + conferenceData.eventbriteId + '/attendees/';
                        api.oauthToken = conferenceData.eventbriteToken;
                        api.contentType = 'application/json';
                        api.data = {
                            token: conferenceData.eventbriteToken
                        };
                        api.get(function (result) {
                            try {
                                var attendees = [];
                                if (result.success == true) {
                                    self.clearAttendees(function (clearResult) {
                                        if (clearResult.success == false) {
                                            callBack(clearResult);
                                        }
                                        else {

                                            result.data.attendees.forEach(function (attendee) {
                                                var attendeeData = {
                                                    eventId: attendee.event_id,
                                                    conferenceId: id,
                                                    firstName: attendee.profile.first_name,
                                                    lastName: attendee.profile.last_name,
                                                    name: attendee.profile.name,
                                                    email: attendee.profile.email,
                                                    addresses: attendee.profile.addresses,
                                                    checkedIn: attendee.checked_in,
                                                    status: attendee.status
                                                };
                                                self.saveAttendees(attendeeData);
                                                attendees.push(attendeeData);
                                            });

                                            callBack(success.success(attendees));
                                        }
                                    });
                                }
                                else {
                                    callBack(result);
                                }
                            }
                            catch (e) {
                                console.log(e);
                            }

                        });
                    }
                }
            });
        }

    });

};

self.getAttendeeByEventId = function(id, callBack){
    mongoose.connection.db.collection(config.eventBriteAttendeeCollection, function (err, collection) {console.log("getting collectn er",err);console.log("geting collection data",collection);
        collection.find({eventId:id}).toArray(function (errors,data) { console.log("errors",errors); console.log("data",data);
           if(err){
               callBack(error.internalError(errors));
           }
           else
           {
               callBack(success.success(data));
           }
        });
    });
};
self.getAttendeeByConferenceId = function(id, callBack){
    mongoose.connection.db.collection(config.eventBriteAttendeeCollection, function (err, collection) {
        collection.find({conferenceId:id}).toArray(function (err,data) { console.log(err,data)
            if(err){
                callBack(error.internalError(err));
            }
            else
            {
                callBack(success.success(data));
            }
        });
    });
};

self.clearAttendees = function (callBack) {
    Attendee.remove(function (err, data) {
        if (err) {
            callBack(error.internalError(err));
        }
        else {
            callBack(success.success(data));
        }
    });
};

self.saveAttendees = function (data) {
    var attendee = new Attendee(data);
    attendee.save(function (err, data) {
        console.log(err, data);
    });
};

self.test = function (callBack) {
    // self.updateAttendeeCollectionByEvent('32214579675', 'GCW4L7HZM5TFGKC25R7M', function (result) {
    self.updateAttendeeCollectionByEvent('32214579675', function (result) {
        callBack(result);
    });
};
