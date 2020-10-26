



/** Routes for orders. */

const express = require("express");
const router = express.Router();

const { ensureCorrectUser, authRequired } = require("../middleware/auth");

const Cart = require("../models/cart");
const User = require("../models/user");
const Order = require("../models/order");



/** POST / => make an order*/

router.post('/:username/order', authRequired, async (req, res, next) => {
    //  create a new order using the user_id
    try {
        const { id } = await User.findOne(req.params.username)
        await Order.createOrder(id)
        return res.send({msg: " order submitted"})

    } catch (e) {
        console.log(e)
        return next(e)
    }



})


/** POST / => retrieve order history for a user*/

router.post('/:username/order-history', authRequired, async (req, res, next) => {
    //  create a new order using the user_id
    try {
        const { id } = await User.findOne(req.params.username)
        const result = await Order.getOrders(id)
        return res.send(result)

    } catch (e) {
        console.log(e)
        return next(e)
    }



})


/** POST / => delete an order*/
router.delete('/:username/delete-order', authRequired, async (req, res, next) => {
    //  create a new order using the user_id
    try {
        //  the order_id comes from the frontEnd
        await Order.deleteOrder(order_id)
        return res.send({msg:"order deleted"})

    } catch (e) {
        console.log(e)
        return next(e)
    }



})


module.exports = router