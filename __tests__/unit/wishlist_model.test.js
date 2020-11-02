process.env.NODE_ENV === 'test'
const db = require('../../db')
const bcrypt = require("bcrypt");


const User = require('../../models/user')
const Wishlist = require('../../models/wishlist')

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
    await db.query('DELETE from wishlist')

})
afterAll(async () => {

    await db.end()
})

describe('Add to wishlist', () => {
    test('Adding to wishlist', async () => {

        const res = await User.findOne(user.username)
        let result = await Wishlist.addToWishlist(res.id, 3)
        expect(result).toHaveProperty('message', 'Added item from wishlist')
    })
})

describe('Remove from wishlist', () => {
    test('Removing from wishlist, success', async () => {

        const res = await User.findOne(user.username)
         await Wishlist.addToWishlist(res.id, 3)
        let result = await Wishlist.removeFromWishlist(res.id, 3)
        expect(result).toHaveProperty('message', 'Removed item from wishlist')
    })

    test('Removing from wishlist, failed due to item not existing on user\s wishlist', async () => {

        const res = await User.findOne(user.username)
        let result = await Wishlist.removeFromWishlist(res.id, 3)
        expect(result.message).toEqual('can not remove an item that does not exists')
    })
})