/**
 * update.js
 * New update() with validation of Mongoose
 *
 * written by yuribossa
 * http://twitter.com/yuribossa
 */

/**
 * setNewUpdate
 * @param {Connection} connection to use
 * @param {Model} model object
 * @api public
 *
 * example
 * var update = require('update');
 * var con = mongoose.createConnection('mongodb:localhost/db');
 * var Account = con.Model('Account');
 * con = update.setNewUpdate(con, Account);
 */
module.exports = {
    'setNewUpdate': function(con, model) {
        con.base.Model.update = function(conditions, update, options, callback) {
            model.findOne(conditions, function(err, doc) {
                if (err) {
                    return callback(err);
                }
                if (!doc) {
                    return callback(new Error('Not exists.'));
                }
                for (var ope in update) {
                    switch (ope) {
                        case '$set':
                            for (var key in update['$set']) {
                                doc[key] = update['$set'][key];
                            }
                            // in save() validation run
                            doc.save(function(err) {
                                callback(err);
                            });
                            break;
                        case '$push':
                            for (var key in update['$push']) {
                                doc[key].push(update['$push'][key]);
                            }
                            // in save() validation run
                            doc.save(function(err) {
                                callback(err);
                            });
                            break;
                    }
                }
            });
        };
        return con;
    }
};

