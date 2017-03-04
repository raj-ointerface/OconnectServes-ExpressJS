/**
 * Created by arun
 */

var unirest = require('unirest');
var mongoose = require('mongoose');
var shortid = require('shortid');
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

                        var api = new Api();
                        api.url = 'https://www.eventbriteapi.com/v3/events/' + conferenceData.eventbriteId + '/attendees/';
                        api.oauthToken = conferenceData.eventbriteToken;
                        api.contentType = 'application/json';
                        api.data = {
                            token: conferenceData.eventbriteToken
                        };
                        api.get(function (result) {
                            try {

                                if (result.success == true) {

                                    var attendees = [];
                                    result.data.attendees.forEach(function (attendee) {
                                        var data = {
                                            _id: shortid.generate(),
                                            eventbriteId: attendee.event_id,
                                            _p_conference: 'Conference$' + id,
                                            firstName: attendee.profile.first_name,
                                            lastName: attendee.profile.last_name,
                                            name: attendee.profile.name,
                                            email: attendee.profile.email,
                                            // addresses: attendee.profile.addresses,
                                            isCheckedIn: false,
                                            // status: attendee.status,
                                            _created_at: new Date(),
                                            _updated_at: new Date(),
                                            isDeleted: false
                                        };
                                        attendees.push(data);
                                    });
                                    
                                    self.compareAndSaveAttendees(attendees,conferenceData.eventbriteId, id, function (saveResult) {
                                      callBack(saveResult);
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

self.getAttendeeByEventId = function (id, callBack) {
    mongoose.connection.db.collection(config.attendeeCollection, function (err, collection) {

        collection.find({eventbriteId: id}).toArray(function (errors, data) {
            if (err) {
                callBack(error.internalError(errors));
            }
            else {
                callBack(success.success(data));
            }
        });
    });
};

self.getAttendeeByConferenceId = function (id, callBack) {
    id = 'Conference$' + id
    mongoose.connection.db.collection(config.attendeeCollection, function (err, collection) {
        collection.find({_p_conference: id}).toArray(function (err, data) {
            console.log(err, data)
            if (err) {
                callBack(error.internalError(err));
            }
            else {
                callBack(success.success(data));
            }
        });
    });
};

self.clearAttendees = function (id, callBack) {
    id = 'Conference$' + id;
    mongoose.connection.db.collection(config.attendeeCollection, function (err, collection) {
        collection.remove({_p_conference: id}, function (err, data) {
            if (err) {
                callBack(error.internalError());
            }
            else {
                callBack(success.success(data));
            }
        });
    });
};

self.saveAttendees = function (data) {
    mongoose.connection.db.collection(config.attendeeCollection, function (err, collection) {
        collection.insert(data, function (err, data) {
            console.log("saveeee",err, data)
        });
    });
};


self.compareAndSaveAttendees = function (eventBriteData, eventId,id, callBack) {
    mongoose.connection.db.collection(config.attendeeCollection, function (err, collection) {
        collection.find({eventbriteId: eventId}).toArray(function (errors, oconnectData) {
            if (err) {
                callBack(error.internalError(err));
            }
            else {
                var attendees = [];
                eventBriteData.forEach(function (eventData,count) {
                    var flag = false;
                    oconnectData.forEach(function (data) {
                        if(!flag){
                            if(eventData.email == data.email){
                                flag = true;
                            }
                        }
                    });

                    if(!flag){
                        attendees.push(eventData);
                        self.saveAttendees(eventData);
                    }

                });


                callBack(success.success(oconnectData.concat(attendees)));


            }
        });
    });
};




