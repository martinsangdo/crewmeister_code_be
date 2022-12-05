//grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Constant = require('../common/constant.js');

// create a schema
var memberSchema = new Schema({
  crewId: Number,
  id: Number,
  image: String,
  name: String,
  userId: Number
}, { collection: 'members' });

// the schema is useless so far
// we need to create a model using it
var Member = mongoose.model('Member', memberSchema);

//
Member.prototype.find = function(condition, fields, resp_func){
  Member.find(condition).select(fields).exec(function(err, res) {
    if (err) {
      var resp = {
        result : Constant.FAILED_CODE,
        message : Constant.SERVER_ERR
      };
      resp_func(resp);
    } else {
      var resp = {
        result : Constant.OK_CODE,
        data : res
      };
      resp_func(resp);
    }
  });
};

// make this available to our users in our Node applications
module.exports = Member;
