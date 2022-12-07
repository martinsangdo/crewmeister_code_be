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
    var skip = {'$skip': 0};
    var limit = {'$limit': Constant.DEFAULT_PAGE_LENGTH};
    if (parseInt(page_index) >= 0 && parseInt(page_limit) > 0){
        limit['$limit'] = parseInt(page_limit);
        skip['$skip'] = parseInt(page_index) * parseInt(page_limit);
    }
    var utility = new Utility();

    if (utility.isNotBlank(type)){
        condition['type'] = type;
    }
    //convert date string to Date obj
    var projectObj = {
        admitterNote: 1,
        confirmedAt: 1,
        endDate: 1,
        memberNote: 1,
        rejectedAt: 1,
        startDate: 1,
        type: 1,
        userId: 1
    };
    if (utility.isNotBlank(start_date)){
        projectObj['_start_date'] = {   //new field, convert from string to Date
            $dateFromString: {
                dateString: '$startDate',
                format: "%Y-%m-%d"
            }
        };
        condition['_start_date'] = {
            '$gte': new Date(start_date)
        };
    }
    if (utility.isNotBlank(end_date)){
        projectObj['_end_date'] = {   //new field, convert from string to Date
            $dateFromString: {
                dateString: '$endDate',
                format: "%Y-%m-%d"
            }
        };
        condition['_end_date'] = {
            '$lte': new Date(end_date)
        };
    }
    var aggregate = [   //query total
        {
            '$project': projectObj
        },
        {
            '$match': condition
        }
    ];
    var pagination_aggregate = [
        {
            '$project': projectObj
        },
        {
            '$match': condition
        },
        {
            '$sort': {
                confirmedAt: -1
            }
        }
    ];
    pagination_aggregate.push(skip);
    pagination_aggregate.push(limit);
    // console.log('pagination_aggregate', pagination_aggregate);
    var absence = new Absence();
    absence.query_aggregate(pagination_aggregate, function (absence_list){
        //search member info, if any
        query_extra_info(aggregate, absence_list, condition, res);
    });
});

//private function
function query_member_info(member_ids, callback){
    var member = new Member();
    member.find({
        userId: {"$in": member_ids}
    }, 'userId image name', callback);
}
//call after query absence list
function query_extra_info(aggregate, absence_list, condition, res){
    var absence = new Absence();
    var utility = new Utility();
    if (absence_list.result == Constant.OK_CODE){
        //find total items (no pagination)
        // console.log('aggregate', aggregate);
        absence.query_aggregate(aggregate, function(resp_total){
            if (resp_total.result == Constant.OK_CODE){
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
                        member_list: member_list.data,
                        total: resp_total.data.length
                    });
                });
            } else {
                //failed
                res.status(500).send(absence_list);
            }
        });
    } else {
        //something wrong with server
        res.status(500).send(absence_list);
    }
}

module.exports = router;
