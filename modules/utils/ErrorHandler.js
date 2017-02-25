/**
 * Created by Aj on 25-12-2016.
 */


module.exports = {

    checkEmpty : function (input) {
        
        if(input == ''){
            return true;
        }
        else
            return false;

    },

    checkAlphabets : function (input) {
        return /^[a-zA-Z]+$/.test(input);
    },
    
    checkDigit : function (input) {
        return /^[0-9]+$/.test(input);
    },
    
    checkSpecialCharecters : function (input) {
        return /[^\w\s]/gi.test(input);
    },
    
    checkInputs : function (inputs) {
        try{
            var flag = true;
            inputs.forEach(function (input) {
               if(input == '' || input == undefined || input == 'undefined' || input == null  ){ console.log(input)
                   flag  = false;
               }
            });
            return flag;
        }
        catch(e){
            console.log(e);
        }
    },
    
    checkEmail : function (email) {
        return  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    },

    checkPhone : function (phone) {
        return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone);
    },

    checkTrue : function (inputs) {
        try{
            var flag = true;
            var item =[] ;
            inputs.forEach(function(input){
               if(input == true || input == 'true' || input == 1){
                   flag = true
               }
               else
               {
                   flag = false;
                   item.push(input);
               }
            });
           if(item.length == 0){
                return  true;
            }
            else
           {
               return item[0];
           }
        }
        catch (e){
            console.log(e);
        }
    }
    
    


};




