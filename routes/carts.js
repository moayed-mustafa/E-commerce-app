

/** Routes for users. */

const express = require("express");
const router = express.Router();

const { ensureCorrectUser, authRequired } = require("../middleware/auth");

const Cart = require("../models/cart");
const User = require("../models/user");




/** POST / => add to cart*/

router.post('/:username/add', authRequired, async (req, res, next) => {
    console.log("adding a cart")
    const {id} = await User.findOne(req.params.username)
    //  *have to test the product_id manually since it only comes from the front end
     await Cart.addToCart(id, 434)
    return res.send({msg: "item added"})

})


module.exports = router


