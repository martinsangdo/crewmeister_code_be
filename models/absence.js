//grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Constant = require('../common/constant.js');

// create a schema
var absenceSchema = new Schema({
  admitterId: Number,
  admitterNote: String,
  confirmedAt: Date,
  createdAt: String,
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

//find data with date range
Absence.prototype.query_aggregate = function(aggregate, resp_func){
  Absence.aggregate(aggregate).exec(function(err, res) {
    if (err) {
      console.log(err);
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
module.exports = Absence;
