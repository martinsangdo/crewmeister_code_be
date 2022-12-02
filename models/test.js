//grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create a schema
var testSchema = new Schema({
id: Number,
userId: { type: Number, ref: 'User' },
name: String
}, { collection: 'test1' });

//the schema is useless so far
//we need to create a model using it
var Test = mongoose.model('Test', testSchema);

//make this available to our users in our Node applications
module.exports = Test;