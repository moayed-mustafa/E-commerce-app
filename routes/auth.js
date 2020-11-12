


// * Routes for users. */

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const createToken = require("../helpers/createToken");

router.post("/login", async function (req, res, next) {
    try {
      const user = await User.authenticate(req.body);

      if (!user.message) {
        const token = createToken(user);
        user._token = token
        return res.json({ _token:token });
      } else {
        return res.status(user.status).json({message:user.message})
      }
    } catch (e) {
      return next(e);
    }
});



  module.exports = router;