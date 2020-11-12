

/** Routes for carts. */

const express = require("express");
const router = express.Router();

const { ensureCorrectUser, authRequired } = require("../middleware/auth");

const Cart = require("../models/cart");
const User = require("../models/user");




/** POST / => add to cart*/

router.post('/:username/add', authRequired, ensureCorrectUser, async (req, res, next) => {
    try {
        const { id } = await User.findOne(req.params.username)

        product_id = req.body.product_id
         await Cart.addToCart(id, product_id)
        return res.send({message: "item added"})

    } catch (e) {
        return next(e)
    }

})
/** POST / => remove from cart*/

router.post('/:username/remove', authRequired  , ensureCorrectUser, async (req, res, next) => {
    try {
        const {id} = await User.findOne(req.params.username)

        product_id = req.body.product_id

        let result = await Cart.removeFromCart(id, product_id)
        return res.status(result.status).send({message: result.message})

    } catch (e) {
        return next(e)
    }

})
/** POST / => remove a cart*/

router.delete('/:username/destroy-cart', authRequired , ensureCorrectUser, async (req, res, next) => {
    try {
        const {id} = await User.findOne(req.params.username)
        //  *have to test the product_id manually since it comes from the front end
        await Cart.destroyCart(id)
        return res.send({message: "cart destroyed"})

    } catch (e) {
        return next(e)
    }

})


module.exports = router


