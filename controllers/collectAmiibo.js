const util = require('util');

const handleCollect = (req, res, pool) => {
    const {user, amiibos} = req.body;
    const externalIDs = amiibos.map((amiibo) => amiibo.external_id);
    const toBeAdded = amiibos.filter((amiibo) => amiibo.collected).map((amiibo) => amiibo.external_id);
    const toBeRemoved = amiibos.filter((amiibo) => !amiibo.collected).map((amiibo) => amiibo.external_id);

    if (amiibos.length > 0) {
        pool.query('SELECT external_id FROM amiibo WHERE external_id IN (?)', [externalIDs])
        .then(([rows, fields]) => {
            const existingExternalIDs = rows.map((result) => result.external_id);
            const toInsert = externalIDs.filter((externalID) => !existingExternalIDs.includes(externalID)).map((externalID) => [externalID]);

            if (toInsert.length > 0) {
                return pool.query('INSERT INTO amiibo (external_id) VALUES ?', [toInsert]);
            }
            else {
                return;
            }
        })
        .then(() => {
            if (toBeAdded.length > 0) {
                return pool.query(`SELECT user_id FROM user WHERE email = ?`,[user.email])
            }
            else {
                return Promise.reject("toBeAdded has length 0");
            }
        })
        .then(([rows, fields]) => {
            if (rows.length > 0) {
                return Promise.resolve(rows[0].user_id);
            }   
            else {
                return Promise.reject("User doesn't exist");
            }    
        })
        .then ((userID) => {
            return pool.query('SELECT * FROM amiibo WHERE external_id IN (?)', [toBeAdded])
                .then(([rows, fields]) => {
                    return Promise.resolve(rows.map((row) => [userID, row.amiibo_id, user.email, row.external_id]));
                });
        })
        .then((values) => {
            pool.query(`INSERT IGNORE INTO user_amiibo (user_id, amiibo_id, email, external_id) VALUES ?`, [values]);
        })
        .catch((e) => console.log(e))
        .then(() => {
            if (toBeRemoved.length > 0) {
                return pool.query(`SELECT user_id FROM user WHERE email = ?`,[user.email])
            }
            else {
                return Promise.reject("toBeRemoved has length 0");
            }
        })
        .then(([rows, fields]) => {
            if (rows.length > 0) {
                return Promise.resolve(rows[0].user_id);
            }   
            else {
                return Promise.reject("User doesn't exist");
            }    
        })
        .then ((userID) => {
            return pool.query('SELECT * FROM amiibo WHERE external_id IN (?)', [toBeRemoved])
                .then(([rows, fields]) => {
                    return Promise.resolve(rows.map((row) => [userID, row.amiibo_id, user.email, row.external_id]));
                });
        })
        .then((values) => {
            return pool.query(`DELETE FROM user_amiibo WHERE (user_id, amiibo_id, email, external_id) IN ?`, [values]);
        })
        .catch((e) => console.log(e));
    }
    else {
        res.status(400).json("No amiibos received");
    }

    /*if (toBeRemoved.length > 0) {
        pool.query(`DELETE FROM user_amiibo WHERE external_id IN ?`, [toBeRemoved]);
    }*/
}

module.exports = {
    handleCollect: handleCollect
}

/*{
    "user": {
        "email": "marcusbrookswebdev@gmail.com"
    },
    "amiibos": [
        {
            "external_id": "0000000000000001",
            "collected": true
        },
                {
            "external_id": "0000000000000002",
            "collected": true
        },
                {
            "external_id": "0000000000000003",
            "collected": true
        }
    ]
}*/