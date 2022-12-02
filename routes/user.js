
/*
 * GET users listing.
 */
var User = require('../models/user.js');
var Test = require('../models/test.js');


exports.list = function(req, res){
  res.send("respond with a resource rrr");
};
//http://www.tutorialspoint.com/mongodb/mongodb_autoincrement_sequence.htm

exports.getuser = function(req, res){
	// create a new user
	
//	var test = Test({
//		_id: ,
//		id: 7,
//		userId: 4,
//	  name: 'test name 5'
//	});
//
//	// save the user
//	test.save(function(err) {
//	  if (err) throw err;
//
//	  console.log('Test created!');
//	});
	
	
//	Test
//	.findOne({ id: 5 })
//	.populate('userId')
//	.exec(function (err, test) {
//	  console.log(err);
//	  console.log(test.userId.name);
//	  // prints "The creator is Aaron"
//	});
	
	// get all the users
//	Test.find({}, function(err, users) {
//	  if (err) throw err;
//
//	  // object of all the users
//	  console.log(users);
//	  res.send('finished');
//	});
	
};