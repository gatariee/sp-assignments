# Changes in backend from CA1 to CA2

## Refactoring 
- Every single API has been branched into their own file in the backend, previously all of the APIs were in a single `api.js` file.
- Nearly every endpoint has been renamed to be more descriptive of what it does, and what permissions are required to access it.
- As the backend will not be protected from direct access, all endpoints have been refactored to return what fields are required to be sent in the request body.
- All endpoints have been attached to a middleware to check depending on the sensitivity of the endpoint, if the user has the required permissions to access it.
