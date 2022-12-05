/*
 * author: Martin
 */
var express = require("express");
var router = express.Router();
var Absence = require('../models/absence.js');
var Member = require('../models/member.js');
var Constant = require('../common/constant.js');
var Utility = require('../common/utility.js');

/*
* Get list of absences based on condition(s)
* Response with Pagination
 */
router.get("/list", function(req, res){
    const { page_index, page_limit, type, start_date, end_date } = req.query;
    var condition = {};
    var pagination = {
        skip: 0,
        limit: Constant.DEFAULT_PAGE_LENGTH
    };
    if (page_index >= 0 && page_limit > 0){
        pagination['limit'] = page_limit;
        pagination['skip'] = page_index * page_limit;
    }
    var utility = new Utility();
    if (utility.isNotBlank(type)){
        condition['type'] = type;
    }
    if (utility.isNotBlank(start_date != null)){
        //todo
    }
    if (utility.isNotBlank(end_date != null)){
        //todo
    }
    var absence = new Absence();
    var fields = 'admitterNote confirmedAt endDate memberNote rejectedAt startDate type userId';
    absence.paging_list(condition, fields, pagination, {'confirmedAt':-1}, function (absence_list){
        //search member info, if any
        if (absence_list.result == Constant.OK_CODE){
            var member_ids = [];
            absence_list.data.forEach(obj => {
                member_ids.push(obj.userId);
            });
            //remove duplicated ids
            var unique_member_ids = utility.removeDuplication(member_ids);
            //
            query_member_info(unique_member_ids, function(member_list){
                //for saving server capability, let client parse the data
                res.status(200).send({
                    absences: absence_list.data,
                    member_list: member_list.data
                });
            });
        } else {
            //something wrong with server
            res.status(500).send(absence_list);
        }
    });
});

//private function
function query_member_info(member_ids, callback){
    var member = new Member();
    member.find({
        userId: {"$in": member_ids}
    }, 'userId image name', callback)
}

module.exports = router;
