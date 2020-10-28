

/** Routes for users. */

const express = require("express");
const router = express.Router();

const { ensureCorrectUser, authRequired } = require("../middleware/auth");

const User = require("../models/user");

const {signUpSchema, updateUserSchema} = require("../schemas/userSchemas");

const createToken = require("../helpers/createToken");

/** GET / => {users: [user, ...]} */
router.get("/", authRequired, async function(req, res, next) {
    try {
      const users = await User.findAll();
      return res.json({ users });
    } catch (err) {
      return next(err);
    }
});

//   ============================================================================================================================================================


/** GET /[username] => {user: user} */
router.get("/:username", authRequired, async function(req, res, next) {
    try {
      const user = await User.findOne(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
});
//   ============================================================================================================================================================

/** POST / {userdata}  => {token: token} */
router.post("/signup", async (req, res, next) => {

    const { error } = signUpSchema.validate(req.body)
    if (error) return next({ status: 400, error: error.message });

    try {
      const newUser = await User.register(req.body)
        const token = createToken(newUser);
        newUser._token = token
        return res.status(201).json({_token:token});

    } catch (e) {
        return next(e)
    }

})
//   ============================================================================================================================================================


/** PATCH /[handle] {userData} => {user: updatedUser} */

router.patch("/:username", ensureCorrectUser, async function(req, res, next) {
  try {

        //  * make an update user schema
        const {error} = updateUserSchema.validate(req.body)
      if (error) {
        return next({
          status: 400,
          message: error.message
        });
      }

      const user = await User.update(req.params.username, req.body);


      return res.json({ ...user });
    } catch (err) {
      return next(err);
    }
  });

  //   ============================================================================================================================================================

/** DELETE /[handle]  =>  {message: "User deleted"}  */
router.delete("/:username", ensureCorrectUser, async function(req, res, next) {
    try {
      await User.remove(req.params.username);
      return res.json({ message: "User deleted" });
    } catch (err) {
      return next(err);
    }
  });


module.exports = router;

