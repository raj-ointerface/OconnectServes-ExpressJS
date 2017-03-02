/**
 * Created by arun on 24/2/17.
 */

module.exports = {


    success : function (data) {

        var response = {
            'success' : true,
            'data' : data

        };

        return (response);

    } ,

    successTrue : function () {
        var response = {
            'success' : true
        };

        return (response);
    }


};