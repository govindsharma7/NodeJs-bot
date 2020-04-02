const History = require('../models/historyModel');

/**
 * Controller for the history
 */

module.exports = {
    create: data => {
        History.create(data);
    },
    findOne: (userRecord, callback) => {
        History.findOne({
            "search_key": {
                "$regex" : userRecord.query, "$options" : 'i'
            }, "user.id": userRecord.user.id
        }, (err, historyData) => {
            if (err) {
                console.error(err);
                return callback(err, null);
            }
            console.log(historyData)
            return callback(null, historyData);
        });
    },
    update: (_id, data, callback) => {
        History.updateOne({
            _id: _id }, { "$set": { data }
        }, (updateErr, updateRes) => {
            if (updateErr) {
                console.error('Error while updating: ', updateErr);
                return callback(updateErr, null);
            }
            console.log('Update Result :', updateRes);
            return callback(null, updateRes);
        });
    },
    searchString: (stringData, user, callback) => {
        History.find({ "search_key": {
            "$regex" : stringData, "$options" : 'i'
        }, "user.id": user.id }, ( searchErr, historyData ) => {
            if ( searchErr ) {
                console.error('Error while searching: ', searchErr);
                return callback(searchErr, null);
            }
            console.log('Search Result :', historyData);
            return callback(null, historyData);
        });
    },
    findOneAndUpdate: (filter, update) => {
        History.findOneAndUpdate({_id: _id}, {result: data})
    }
}
