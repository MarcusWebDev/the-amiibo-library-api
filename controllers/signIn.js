const handleSignIn = (req, res, pool) => {
    const {email} = req.body;
    pool.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
        console.log("what was found: " + results);
        if (results.length == 0) {
            pool.query('INSERT INTO user (email) VALUES (?)', [email], (err, results) => {
                console.log("created: " + results);
                res.status(201).json('User Created.');
            });
        }
        else {
            console.log("exists: " + results);
            res.status(409).json('User already exists');
        }
        
    });
}

module.exports = {
    handleSignIn: handleSignIn
}