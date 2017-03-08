/**
 * Created by arun on 7/3/17.
 */

var mongoose = require('mongoose');
var error = require('../utils/Error');
var success = require('../utils/Success');
var config = require('../config');

var self = module.exports = {};

self.checkInAccess = function (organisationId, status, attendeeLabel, callBack) {
    UpdateStatusInOrganisation(organisationId, status, attendeeLabel, function (updateResult) {
        findConferencesOfOrganisation(organisationId, function (findResult) {
            updateStatusinSpeaker(attendeeLabel, findResult.data, status, function (result) {
                callBack(result);
            });
        });
    });
};


function UpdateStatusInOrganisation(organisationId, status, attendeeLabel, callBack) {


    mongoose.connection.db.collection(config.organisationCollection, function (err, collection) {
        if (err) {
            callBack(error.internalError(err));
        }
        else {
            collection.update(
                {_id: organisationId, speakerLabels: {$elemMatch: {label: attendeeLabel}}},
                {$set: {'speakerLabels.$.checkInAccess': status}},
                {upsert: true},
                function (updateError, updateResult) {
                    if (updateError) {
                        callBack(error.internalError(updateError));
                    }
                    else {
                        callBack(success.success(updateResult));
                    }
                });
        }
    });


}

function updateStatusinSpeaker(label, data, status, callBack) {
    mongoose.connection.db.collection(config.speakerCollection, function (err, collection) {
        if (err) {
            callBack(error.internalError(err));
        }
        else {
            collection.update(
                {speakerLabel: label, _p_conference: {$in: data}},
                {$set: {'allowCheckIn': status}},
                {multi: true},
                function (updateError, result) {
                    if (updateError) {
                        callBack(error.internalError(updateError));
                    }
                    else {
                        // callBack(result)
                        callBack(success.successTrue());
                    }
                });
        }
    });
}

function findConferencesOfOrganisation(id, callBack) {
    id = 'Organization$' + id;
    mongoose.connection.db.collection(config.conferenceCollection, function (err, collection) {
        collection.find({_p_organization: id}).toArray(function (err, data) {
            if (err) {
                callBack(error.internalError(err));
            }
            else {
                var ids = [];
                data.forEach(function (item) {
                    ids.push('Conference$' + item._id)
                });
                callBack(success.success(ids));
            }
        });
    });
}