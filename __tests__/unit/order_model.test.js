/** Testing Order Model */

process.env.NODE_ENV === 'test'
const db = require('../../db')
const bcrypt = require("bcrypt");


const User = require('../../models/user')
const Cart = require('../../models/cart')
const Order = require('../../models/order')

let user;
beforeEach(async () => {
    //  create a user
    user = {
        "username": "test",
        "password": "123456",
        "first_name": "test",
        "last_name": "user",
        "email": "test_user@email.com",
        "address": "Main Beach Road, Abudhabi"
    }
    //  register
     await User.register(user);




})
afterEach(async () => {
    await db.query('DELETE from users')
    await db.query('DELETE from carts')

})
afterAll(async () => {

    await db.end()
})

describe('Make order', () => {
    test('Successful order' ,async () => {
        //  add items to cart
        const res = await User.findOne(user.username)
        await Cart.makeCart(res.id)
        await Cart.addToCart(res.id, 3)
        await Cart.addToCart(res.id, 31)
        // make an order
        let result = await Order.createOrder(res.id)
        expect(result.message).toEqual("Order submitted.")

    })
    test('Usuccessful order, cart is empty' ,async () => {
        //  add items to cart
        const res = await User.findOne(user.username)
        await Cart.makeCart(res.id)
        // make an order
        let result = await Order.createOrder(res.id)
        expect(result.message).toEqual("can not make an order with an empty cart")

    })
})
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

describe('Get all orders', () => {
    test('Successful ' ,async () => {
        //  add items to cart
        const res = await User.findOne(user.username)
        await Cart.makeCart(res.id)
        await Cart.addToCart(res.id, 3)
        await Cart.addToCart(res.id, 31)
        // make an order
        await Order.createOrder(res.id)
        //  get all orders for this user
        let result = await Order.getOrders(res.id)
        expect(result).toHaveLength(2)
        expect(result[0].product_id).toEqual(3)
        expect(result[1].product_id).toEqual(31)


    })
})
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

describe('Delete orders', () => {
    test('Delete an order' ,async () => {
        //  add items to cart
        const res = await User.findOne(user.username)
        await Cart.makeCart(res.id)
        await Cart.addToCart(res.id, 3)
        // make an order
        await Order.createOrder(res.id)
        //  get all orders for this user
        let orders = await Order.getOrders(res.id)

        let result = await Order.deleteOrder(orders[0].product_id)
        expect(result).toHaveProperty('message', 'Order deleted.')


    })
})