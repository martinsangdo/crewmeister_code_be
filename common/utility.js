var Constant = require('./constant.js');

//utility functions
function Utility() {
}
//check 1 object is not null & not blank
Utility.prototype.isNotBlank = function(anything){
    return anything != null && anything !== '';
};
//remove duplicated items in array
Utility.prototype.removeDuplication = function(an_array){
    var seen = {};
    return an_array.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
};
//
module.exports = Utility;