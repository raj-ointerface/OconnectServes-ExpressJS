/**
 * Created by arun
 */



var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var ErrorHandler = require('../modules/utils/ErrorHandler');
var Error = require('../modules/utils/Error');
var getAttendee = require('../modules/eventBrite/getAttendeeByEvent');


router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.post('/getAttendees',function (req,res) {

    if(ErrorHandler.checkInputs([req.body.id])){

        getAttendee.getAttendeeByEvent(req.body.id, function (result) {
            if (result.success == false) {
                res.status(result.StatusCode);
                res.send(result);
            }
            else {
                res.status(200);
                res.send(result);
            }
        });

    }
    else
    {
        res.status(401);
        res.send(Error.error('Input Error'));
    }
});












module.exports = router;