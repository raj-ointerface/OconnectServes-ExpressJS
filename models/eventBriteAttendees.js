/**
 * Created by arun
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var attendeSchema = new Schema({

    eventId     : String,
    firstName   : String,
    lastName    : String,
    name        : String,
    email       : String,
    addresses   : Object,
    checkedIn   : String,
    status      : String



});

var attendeDb = mongoose.model('eventBriteAttendees',attendeSchema);

module.exports = attendeDb;