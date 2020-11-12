



/** Routes for carts. */



const express = require("express");
const router = express.Router();

const { ensureCorrectUser, authRequired } = require("../middleware/auth");

const Wishlist = require("../models/wishlist");
const User = require("../models/user");



/** POST / => add to wishlist*/

router.post('/:username/add', authRequired,ensureCorrectUser, async (req, res, next) => {
    try {
        const { id } = await User.findOne(req.params.username)
        const product_id = req.body.product_id
         await Wishlist.addToWishlist(id, product_id)
        return res.send({message: "item added to wishlist"})

    } catch (e) {
        return next(e)
    }

})
/** POST / => remove from wishlist*/

router.post('/:username/remove', authRequired  , ensureCorrectUser, async (req, res, next) => {
    try {
        const {id} = await User.findOne(req.params.username)
            const product_id = req.body.product_id
        let result = await Wishlist.removeFromWishlist(id, product_id)
        console.log(result.message, result.status)
        return res.status(result.status).send({message: result.message})

    } catch (e) {
        return next(e)
    }

})


module.exports = router;