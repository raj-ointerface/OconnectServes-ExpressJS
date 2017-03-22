/*
 *  Copyright (C) Arun J - All Rights Reserved
 *  * Unauthorized copying of this file, via any medium is strictly prohibited
 *  * Proprietary and confidential
 *  * Written by Arun  <arunjayakumar07@gmail.com.com>, June 2016
 *  
 */

/**
 * Created by arun on 14/6/16.
 */


this.checkString = function(string,charecters,callBack) {

    var flag = true;

    charecters.forEach(function(char){
        if(string.indexOf(char) == -1)
        {
            flag = false;
        }
        
    });

    console.log(flag);
    if(callBack!= undefined || callBack != null || callBack!='') {
        callBack(flag);
    }
    return flag;

};

this.generateRandomNumber = function(count,callBack){
    var min,max;
    
    if(count>1) {
       min = Math.pow(10, count-1);
       max = Math.pow(10, count) - 1;
    }
    else
    {
        min = 1;
        max = 9;
    }

    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(num);
    callBack(num);

};

this.generateRandomString = function (count) {

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < count; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    console.log(text);
    // callBack(text);
    return text;
};


// generateRandomString(10);
// generateRandomNumber(1);
// checkString('arunjayakumar07@gmail.com',['@','.']);