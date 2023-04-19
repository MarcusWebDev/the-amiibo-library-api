const util = require('util');

const handleGetAmiibo = async (req, res, pool) => {
    const email = req.params.email;
    pool.query('SELECT external_id FROM user_amiibo WHERE email = ?', [email])
        .then(([rows, fields]) => {
            if (rows.length > 0) {
                let externalIDs = rows.map((row) => row.external_id);
                res.status(200).json(externalIDs);
            }
            else {
                res.status(400).json("User does not have any amiibos or user does not exist.");
            }
        })
        .catch((e) => console.log(e));
}

module.exports = {
    handleGetAmiibo: handleGetAmiibo
}