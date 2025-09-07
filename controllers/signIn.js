const handleSignIn = (req, res, pool) => {
  const { user } = req.body;

  pool
    .query("INSERT IGNORE INTO user (email) VALUES (?)", [user.email])
    .then(() => {
      res.status(200).json("User created or already exists.");
    })
    .catch((e) => console.error(e));
};

module.exports = {
  handleSignIn: handleSignIn,
};
