

const request = require('supertest')
const app = require('../app')

const User = require('../models/user')

process.env.NODE_ENV === 'test'
const db = require('../db')

// set up the test:
let test_user;
let test_user_two;
let test_product_id = 344
beforeEach(async () => {
    // create a couple of users
    test_user= {
        "username": "test",
        "password": "123456",
        "first_name": "test",
        "last_name": "user",
        "email": "test_user@email.com",
        "address": "Main Beach Road, Abudhabi"
    }
    test_user_two= {
        "username": "test_two",
        "password": "123456",
        "first_name": "test",
        "last_name": "user",
        "email": "test_user_two@email.com",
        "address": "GBR, Dubai"
    }



     await User.register(test_user)
    await User.register(test_user_two)

})

afterEach(async () => {
    await db.query('DELETE FROM users')
    await db.query('DELETE FROM items')
    await db.query('DELETE FROM carts')

})
afterAll(async () => {
    await db.end()
})

describe('Add to cart, /carts/:username/add', () => {


    test('adding an item to cart successfuly', async () => {
        let res = await request(app).post('/login').send({
            username: test_user.username,
            password: test_user.password
        });

        let result = await request(app).post(`/carts/${test_user.username}/add`)
            .send({ _token: res.body._token, product_id: test_product_id })

        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty("message", "item added")


    })

    test('adding an item, authentication failure ', async () => {

        let result = await request(app).post(`/carts/${test_user.username}/add`)
            .send({product_id: test_product_id })

        expect(result.statusCode).toEqual(401)
        expect(result.body).toHaveProperty("message", "You must authenticate first.")


    })
    test('adding an item, authorization failure ', async () => {

        let res = await request(app).post('/login').send({
            username: test_user_two.username,
            password: test_user_two.password
        });
        let result = await request(app).post(`/carts/${test_user.username}/add`)
            .send({product_id: test_product_id, _token:res.body._token })

        expect(result.statusCode).toEqual(401)
        expect(result.body).toHaveProperty("message", "You are not authorized.")


    })
})

describe('Remove from cart, /carts/:username/remove', () => {


    test('removing an item from cart successfuly', async () => {
        let res = await request(app).post('/login').send({
            username: test_user.username,
            password: test_user.password
        });


        //  Add an item first
        let addItem = await request(app).post(`/carts/${test_user.username}/add`)
            .send({ _token: res.body._token, product_id: test_product_id })

        expect(addItem.statusCode).toEqual(200)
        expect(addItem.body).toHaveProperty("message", "item added")
        //  remove it now

        let result= await request(app).post(`/carts/${test_user.username}/remove`)
            .send({ _token: res.body._token, product_id: test_product_id })

        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty("message", "item removed")



    })

    test('removing an item that is not currently in the user\'s cart', async () => {
        let res = await request(app).post('/login').send({
            username: test_user.username,
            password: test_user.password
        });




        let result= await request(app).post(`/carts/${test_user.username}/remove`)
            .send({ _token: res.body._token, product_id: 12 })

        expect(result.statusCode).toEqual(404)
        expect(result.body).toHaveProperty( "message" ,'can not remove an item that is not in cart')



    })

    test('removing an item, authentication failure ', async () => {

        let result = await request(app).post(`/carts/${test_user.username}/remove`)
            .send({product_id: test_product_id })

        expect(result.statusCode).toEqual(401)
        expect(result.body).toHaveProperty("message", "You must authenticate first.")


    })
    test('removinging an item, authorization failure ', async () => {

        let res = await request(app).post('/login').send({
            username: test_user_two.username,
            password: test_user_two.password
        });

        let result = await request(app).post(`/carts/${test_user.username}/remove`)
            .send({product_id: test_product_id, _token:res.body._token })

        expect(result.statusCode).toEqual(401)
        expect(result.body).toHaveProperty("message", "You are not authorized.")


    })
})

describe('delete a cart', () => {
    test('delete a cart successfuly', async () => {
        let res = await request(app).post('/login').send({
            username: test_user.username,
            password: test_user.password
        })
        let result = await request(app).delete(`/carts/${test_user.username}/destroy-cart`)
            .send({ _token: res.body._token })

            expect(result.statusCode).toEqual(200)
            expect(result.body).toHaveProperty("message", "cart destroyed")


    })
    test('delete a cart ,authentication failure', async () => {
        let result = await request(app).delete(`/carts/${test_user.username}/destroy-cart`)
            .send({  })

            expect(result.statusCode).toEqual(401)
            expect(result.body).toHaveProperty("message", "You must authenticate first.")


    })
    test('delete a cart ,authorization failure', async () => {
        let res = await request(app).post('/login').send({
            username: test_user_two.username,
            password: test_user_two.password
        })
        let result = await request(app).delete(`/carts/${test_user.username}/destroy-cart`)
            .send({ _token:res.body._token })

            expect(result.statusCode).toEqual(401)
            expect(result.body).toHaveProperty("message", "You are not authorized.")


    })
})