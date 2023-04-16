const util = require('util');

const handleCollect = async (req, res, pool) => {
    const {user, amiibos} = req.body;
    const externalIDs = amiibos.map((amiibo) => [amiibo.external_id]);
    const toBeAdded = amiibos.filter((amiibo) => amiibo.collected).map((amiibo) => amiibo.external_id);
    const toBeRemoved = amiibos.filter((amiibo) => !amiibo.collected).map((amiibo) => amiibo.external_id);
    let userExists = true;

    if (amiibos.length > 0) {
        let userID = await pool.query('INSERT IGNORE INTO amiibo (external_id) VALUES ?', [externalIDs])
            .then(() => {
                return pool.query(`SELECT user_id FROM user WHERE email = ?`,[user.email])
            })
            .then(([rows, fields]) => {
                if (rows.length > 0) {
                    return Promise.resolve(rows[0].user_id);
                }   
                else {
                    return Promise.reject("User doesn't exist");
                }    
            })
            .catch((e) => {
                console.log(e);
                userExists = false;
                res.status(400).json(e);
            });

            if (userExists) {
                const [result1, result2] = await Promise.allSettled([
                    new Promise((resolve, reject) => {
                        if (toBeAdded.length > 0) {
                            resolve(
                                pool.query('SELECT * FROM amiibo WHERE external_id IN (?)', [toBeAdded])
                                    .then(([rows, fields]) => {
                                        return Promise.resolve(rows.map((row) => [userID, row.amiibo_id, user.email, row.external_id]));
                                    })
                            );
                        } 
                        else {
                            reject("Nothing to be added.");
                        }  
                    }) 
                    .then((values) => {
                        pool.query(`INSERT IGNORE INTO user_amiibo (user_id, amiibo_id, email, external_id) VALUES ?`, [values]);
                    }),
    
                    new Promise((resolve, reject) => {
                        if (toBeRemoved.length > 0) {
                            resolve (
                                pool.query('SELECT * FROM amiibo WHERE external_id IN (?)', [toBeRemoved])
                                    .then(([rows, fields]) => {
                                        return Promise.resolve(rows.map((row) => [userID, row.amiibo_id, user.email, row.external_id]));
                                    })
                            );
                        }
                        else {
                            reject("Nothing to be removed.");
                        }
                    })
                    .then((values) => {
                        return pool.query(`DELETE FROM user_amiibo WHERE (user_id, amiibo_id, email, external_id) IN (?)`, [values]);
                    })
                ])
                
                if (result1.status == 'fulfilled' && result2.status == 'fulfilled') {
                    res.status(200).json("Amiibos added and removed from collection.");
                }
                else if (result1.status == 'fulfilled' && result2.status == 'rejected') {
                    res.status(201).json("Amiibos added to collection, nothing removed from collection.")
                }
                else if (result1.status == 'rejected' && result2.status == 'fulfilled') {
                    res.status(200).json("Amiibos removed from collection, nothing added to collection.");
                }
                else {
                    res.status(400).json("No amiibos to add or remove from collection.");
                }
            }
    }
    else {
        res.status(400).json("No amiibos received");
    }
}

module.exports = {
    handleCollect: handleCollect
}
