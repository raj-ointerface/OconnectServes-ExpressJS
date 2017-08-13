/**
 * Created by arun
 */

var unirest = require('unirest');
var Error = require('./Error');
var Success = require('./Success');




function Remote() {
    this.contentType = 'application/json';
    this.oauthToken = '';
    this.contentType = 'application/x-www-form-urlencoded';
    this.cache = 'no-cache';
    this.url = '';
    this.data = '';
    this.accept = 'application/json';
}



Remote.prototype.get = function (callBack) {
    var req = unirest("GET", this.url);

    req.query(this.data);

    req.headers({
        "cache-control": this.cache,
        "oauth-token": this.oauthToken,
        "content-type": this.contentType
    });

    req.end(function (res) {

        if (res.error){
            callBack(Error.error(res.body.error_description,405))
        }
        else
        {
            callBack(Success.success(res.body));
        }

    });
};




module.exports = Remote;