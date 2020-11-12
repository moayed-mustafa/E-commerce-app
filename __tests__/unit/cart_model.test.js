/** Testing Cart Model */

process.env.NODE_ENV === 'test'
const db = require('../../db')
const bcrypt = require("bcrypt");


const User = require('../../models/user')
const Cart = require('../../models/cart')

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

describe('Creating a cart', () => {
    test('create a cart', async () => {
        const res = await User.findOne(user.username)
        let result = await Cart.makeCart(res.id)
        expect(result).toHaveProperty('message', 'Cart Created.')
    })
})
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
describe('Adding to a cart', () => {
    test('create a cart', async () => {
        const res = await User.findOne(user.username)
          await Cart.makeCart(res.id)
        let result = await Cart.addToCart(res.id, 3)
        expect(result).toHaveProperty('message', 'Added to cart.')

    })
})
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
describe('Removing from a cart', () => {
    test('remove from a cart successfuly', async () => {
        const res = await User.findOne(user.username)
        //  make cart
        await Cart.makeCart(res.id)
        //  add to the cart
         await Cart.addToCart(res.id, 3)
        //  remove from the cart
        let result = await Cart.removeFromCart(res.id, 3)
        expect(result).toHaveProperty('message', 'item removed')


    })
    test('remove from a cart failed due to item absence from the cart', async () => {
        const res = await User.findOne(user.username)
        //  make cart
        await Cart.makeCart(res.id)
        //  remove from the cart
        let result = await Cart.removeFromCart(res.id, 3)
        expect(result.message).toEqual("can not remove an item that is not in cart")

    })
})
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
describe('Deleting a cart', () => {
    test('deleting a cart', async () => {
        const res = await User.findOne(user.username)
          await Cart.makeCart(res.id)
        let result = await Cart.destroyCart(res.id)
        expect(result).toHaveProperty('message', 'Deleted Cart.')

    })
})
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++