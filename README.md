# The Amiibo Library API

The API for The Amiibo Library.

## Endpoints

### `POST /signIn`

This endpoint takes a `user` object in the request body and creates a user in the datbase using the `user`'s `email` field. If a user already exists in the database with the provided email, then the endpoint does nothing.

### `POST /collection`

This endpoint takes a `user` object and an `amiibos` array in the request body. It checks if the user exists in the database, if they do, then it will add any amiibo with the `collected` field set to `true` to the user's collection. If the amiibo is in the array and the `collected` field resolves to `false` then it will remove that amiibo from the user's collection.

### `GET /amiibo/:email`

Returns the user with the `email` provided in the url parameters' collected amiibos.

### `GET /amiibo/mostCollected/:amount`

Returns an array of amiibo sorted in descending order based on the number of users that have collected the amiibo. Will return as many amiibo as is specified in the `amount` url parameter.

### `GET /amiibo/leastCollected/:amount`

Returns an array of amiibo sorted in ascending order based on the number of users that have collected the amiibo. Will return as many amiibo as is specified in the `amount` url parameter.
