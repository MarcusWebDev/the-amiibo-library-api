const handleSignIn = (req, res, pool) => {
    const {email} = req.body;

    pool.query('INSERT IGNORE INTO user (email) VALUES (?)', [email])
    .then(([rows, fields]) => {
        res.status(200).json("User created or already exists.");
    });
}



module.exports = {
    handleSignIn: handleSignIn
}