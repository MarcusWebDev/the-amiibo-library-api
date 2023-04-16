const util = require('util');

const handleGetLeastCollected = async (req, res, pool) => {
    pool.query('SELECT COUNT(external_id) as count, external_id FROM user_amiibo GROUP BY external_id ORDER BY COUNT(external_id) ASC LIMIT ?', [parseInt(req.params.amount)])
        .then(([rows, fields]) => {
            let result = rows.map((row) => {
                let resultObject = {
                    count: row.count,
                    external_id: row.external_id
                }
                return resultObject;
            });
            
            res.status(200).json(result);
        });
}

module.exports = {
    handleGetLeastCollected: handleGetLeastCollected
}