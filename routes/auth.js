


// * Routes for users. */

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const createToken = require("../helpers/createToken");

router.post("/login", async function (req, res, next) {
    try {
      const user = await User.authenticate(req.body);
      const token = createToken(user);
      user._token = token
      //  * if I happen to need the whole use then just uncomment the line below
      // return res.json({ ...user });
      return res.json({ _token:token });
    } catch (e) {
      return next(e);
    }
});



  module.exports = router;