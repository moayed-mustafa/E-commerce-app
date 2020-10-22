

/*
    * Main Express app for E-commerce app
*/

//  * require modules.
const express = require('express');
const app = express();
const ExpressError = require('./helpers/expressError')

const cors = require('cors');
app.use(express.json())
app.use(cors())



//  * register routes
const authRoutes = require("./routes/auth")
app.use('/', authRoutes)

const userRoutes = require("./routes/users")
app.use('/users', userRoutes)

const cartRoutes = require("./routes/carts")
app.use('/carts', cartRoutes)




/** 404 handler */

app.use(function(req, res, next) {
    const err = new ExpressError("Not Found", 404);
    return next(err);
  });

  /** general error handler */

app.use((err, req, res, next) => {
    res.status(err.status || 500);

    return res.json({
      //* */ error: err,
      message: err.message,
    });
  });


  module.exports = app;