/**
 * Created by arun on 7/3/17.
 */



var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var ErrorHandler = require('../modules/utils/ErrorHandler');
var Error = require('../modules/utils/Error');
var checkin = require('../modules/organisation/checkinAccess');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.post('/checkinAccess', function (req, res) {
    if (ErrorHandler.checkInputs([req.body.id, req.body.status, req.body.label])) {
        checkin.checkInAccess(req.body.id, req.body.status, req.body.label, function (result) {
            res.send(result);
        });
    }
    else {
        res.status(401);
        res.send({
            success: false,
            error: 'input error'
        })
    }
});


module.exports = router;