const handleSignIn = (req, res, pool) => {
    const {user} = req.body;

    pool.query('INSERT IGNORE INTO user (email) VALUES (?)', [user.email])
    .then(([rows, fields]) => {
        res.status(200).json("User created or already exists.");
    })
    .catch((e) => console.log(e));
}



module.exports = {
    handleSignIn: handleSignIn
}