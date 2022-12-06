//grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Constant = require('../common/constant.js');

// create a schema
var absenceSchema = new Schema({
  admitterId: Number,
  admitterNote: String,
  confirmedAt: Date,
  createdAt: Date,
  crewId: Number,
  endDate: String,
  id: Number,
  memberNote: String,
  rejectedAt: Date,
  startDate: String,
  type: String,
  userId: Number
}, { collection: 'absences' });

// the schema is useless so far
// we need to create a model using it
var Absence = mongoose.model('absences', absenceSchema);

//find with pagination
Absence.prototype.paging_list = function(condition, fields, pagination, sort, resp_func){
  Absence.find(condition).limit(pagination.limit).skip(pagination.skip).
    select(fields).sort(sort).exec(function(err, res) {
    if (err) {
      console.log(err)
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
//find data without pagination
Absence.prototype.list = function(condition, fields, resp_func){
  Absence.find(condition).select(fields).exec(function(err, res) {
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
//find total documents with condition
Absence.prototype.total = function (condition, resp_func) {
  Absence.countDocuments(condition, function (err, res) {
    if (err) {
      var resp = {
        result: Constant.FAILED_CODE,
        message: Constant.SERVER_ERR
      };
      resp_func(resp);
    } else {
      var resp = {
        result: Constant.OK_CODE,
        data: res
      };
      resp_func(resp);
    }
  });
};

// make this available to our users in our Node applications
module.exports = Absence;
