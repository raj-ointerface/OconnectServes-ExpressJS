/**
 * Created by arun
 */

var unirest = require('unirest');
var mongoose = require('mongoose');
var error = require('../utils/Error');
var success = require('../utils/Success');
var config = require('../config');
var Api = require('../utils/CallApi');


var self = module.exports = {};

self.getAttendeeByEvent = function (id,callBack) {

    mongoose.connection.db.collection(config.conferenceCollection, function (err, collection) {

        var query = {_id: id};

        if (err) {
            callBack(error.internalError(err));
        }
        else {
            collection.findOne(query,function (conferenceError, conferenceData) {

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
                    ) { console.log("error");
                        callBack(error.error('EventBrite Details Not Updated, Please check', 403))
                      }
                    else {
                        // callBack(success.success(conferenceData));
                        var api = new Api();
                        api.url = 'https://www.eventbriteapi.com/v3/events/' + conferenceData.eventbriteId + '/attendees/';
                        api.oauthToken = conferenceData.eventbriteToken;
                        api.contentType = 'application/json';
                        api.data = {
                            token : conferenceData.eventbriteToken
                        };
                        api.get(function (result) {
                            try {
                                var attendees = [];
                                if (result.success == true) {
                                    result.data.attendees.forEach(function (attendee) {
                                       var  attendeeData = {
                                           eventId     : attendee.event_id,
                                           firstName   : attendee.profile.first_name,
                                           lastName    : attendee.profile.last_name,
                                           name        : attendee.profile.name,
                                           email       : attendee.profile.email,
                                           addresses   : attendee.profile.addresses,
                                           checkedIn   : attendee.checked_in,
                                           status      : attendee.status
                                       };
                                       attendees.push(attendeeData);
                                    });

                                    callBack(success.success(attendees));

                                }
                                else {
                                    callBack(result);
                                }
                            }
                            catch(e){
                                console.log(e);
                            }


                        });
                    }
                }
            });
        }

    });

};

self.test = function (callBack) {
    // self.getAttendeeByEvent('32214579675', 'GCW4L7HZM5TFGKC25R7M', function (result) {
    self.getAttendeeByEvent('32214579675', function (result) {
        callBack(result);
    });
};
