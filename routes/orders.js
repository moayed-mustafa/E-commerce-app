



/** Routes for orders. */

const express = require("express");
const router = express.Router();

const { ensureCorrectUser, authRequired } = require("../middleware/auth");

const User = require("../models/user");
const Order = require("../models/order");



/** POST / => make an order*/

router.post('/:username/order', authRequired, ensureCorrectUser, async (req, res, next) => {
    //  create a new order using the user_id
    try {
        const { id } = await User.findOne(req.params.username)
        await Order.createOrder(id)
        return res.send({message: "order submitted"})

    } catch (e) {
        return next(e)
    }



})


/** POST / => retrieve order history for a user*/
//  change this to get, pass the username in the request body

router.post('/', authRequired, ensureCorrectUser, async (req, res, next) => {
    //  create a new order using the user_id
    try {
        const { id } = await User.findOne(req.body.username)
        const result = await Order.getOrders(id)
        return res.send(result)

    } catch (e) {
        console.log(e)
        return next(e)
    }



})


/** POST / => delete an order*/
router.delete('/:username/', authRequired, ensureCorrectUser, async (req, res, next) => {
    //  create a new order using the user_id
    try {
        //  the order_id comes from the frontEnd
        const order_id = 1 || req.body.order_id;
        await Order.deleteOrder(order_id)
        return res.send({message:"order deleted"})

    } catch (e) {
        return next(e)
    }



})


module.exports = router
