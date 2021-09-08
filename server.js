const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

const PORT = 4096;

// ideally, this needs to be saved in a .env file 
// (which is excluded by the .gitignore created here)
const SECRET_KEY = 'b528d2e981ae28019e9f0cd792eeb859b411f68b14ac3512889c9f5033e60eac';


// default endpoint
app.get('/', (req, res) => {
    res.status(200).send({
        success: true,
        message: 'Root',
        data: null
    });
});


// login endpoint, which will return
// the token on success
app.post('/login', (req, res) => {
    // in a real application, 
    // this will come from the database after authentication
    const user = {
        EmployeeCode: "100000",
        Password: "066095301b66046b5b72a13da796ce41",
        Salt: "02df1aa0-3143-11ea-8d17-8cec4bb3f382"
    };
    const token = jwt.sign(user, SECRET_KEY);
    res.status(200).send({
        success: true,
        message: 'Login Successful',
        data: { token }
    });
});


// a private endpoint, which only 
// an authenticated user should have access to
app.get('/secret', authenticateToken, (req, res) => {
    // by this point, the user's token
    // has been authenticated, so we are
    // confident that req.user exists
    res.status(200).send({
        user: req.user
    });
});


// token authentication
// this is a "middleware" function
// which takes in the callback function
// next as a parameter
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.status(401).send({
            success: false,
            message: '401 Unauthorized',
            data: null
        });


    jwt.verify(token, SECRET_KEY, (err, user) => {
        console.log(err)
        if (err) return res.status(403).send({
            success: false,
            message: '403 Forbidden',
            data: null
        });

        // user has been authenticated
        // add the user info to the request object
        req.user = user;
        next();
    })
}


// start the server
app.listen(PORT, () => {
    console.log('Server started on port ' + PORT + ', ' + Date());
});