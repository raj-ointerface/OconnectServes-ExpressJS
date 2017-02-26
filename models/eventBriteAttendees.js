/**
 * Created by arun
 */

var mongoose = require('mongoose');
var config = require('../modules/config');
var Schema = mongoose.Schema;

var attendeSchema = new Schema({

    eventId     : String,
    conferenceId: String,
    firstName   : String,
    lastName    : String,
    name        : String,
    email       : String,
    addresses   : Object,
    checkedIn   : String,
    status      : String



});

var attendeDb = mongoose.model(config.eventBriteAttendeeCollection,attendeSchema,config.eventBriteAttendeeCollection);

module.exports = attendeDb;