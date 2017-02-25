/**
 * Created by Aj on 25-12-2016.
 */



module.exports = {

        internalError : function (error) {

            var response = {
                'success' : false,
                'error' : 'Internal Server Error',
                'StatusCode' : 500,
                'message' : error
            };

            return (response);

        }  ,

        error : function (error,statusCode = 401) {

            var response = {
                'success' : false,
                'error' : error,
                'StatusCode' : statusCode,
            };

            return (response);

        }


};