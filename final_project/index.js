const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
      // if user is already authorized
      if (req.session.authorization) {
        // fetch access token
        token = req.session.authorization['accessToken'];
        // verify the access token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                // cache the user object in the request
                req.user = user;
                next();
            }
            //  expired or invalid token
            else {
                return res.status(403).json({message: "Oops! This user is not authenticated"})
            }
        });
    }
    // no login event
    else {
        return res.status(403).json({message: "Sorry, User not logged in"})
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
