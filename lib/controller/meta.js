var parse = require('../core/parse');

/**
 * Meta controller
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
module.exports = function (req, res, next) {
    var url = req.query.q || '';

    url.trim();

    if (!url) {
        return res.status(400).send('Invalid query');
    }

    parse(url, function (err, data) {
        if (err) { return next(err); }

        if (!data) {
            return res.status(404).send({
                success : false,
                error   : 'Not found'
            });
        }

        res.status(200).send({
            success : true,
            data    : data
        });
    });
};