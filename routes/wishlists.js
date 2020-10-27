



/** Routes for carts. */



const express = require("express");
const router = express.Router();

const { ensureCorrectUser, authRequired } = require("../middleware/auth");

const Wishlist = require("../models/wishlist");
const User = require("../models/user");



/** POST / => add to wishlist*/

router.post('/:username/add', authRequired, async (req, res, next) => {
    try {
        const { id } = await User.findOne(req.params.username)
        //  *have to test the product_id manually since it comes from the front end
        // product_id = req.body.product_id
         await Wishlist.addToWishlist(id, 2345)
        return res.send({msg: "item added to wishlist"})

    } catch (e) {
        return next(e)
    }

})
/** POST / => remove from wishlist*/

router.post('/:username/remove', authRequired  , ensureCorrectUser, async (req, res, next) => {
    try {
        const {id} = await User.findOne(req.params.username)
        //  *have to test the product_id manually since it comes from the front end
                // product_id = req.body.product_id

         await Wishlist.removeFromWishlist(id, 2345)
        return res.send({msg: "item removed from wishlist"})

    } catch (e) {
        return next(e)
    }

})


module.exports = router;