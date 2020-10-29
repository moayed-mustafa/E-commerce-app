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
    await db.query('DELETE FROM orders')

})
afterAll(async () => {
    await db.end()
})

describe("make an order", () => {


    test("make a succesful order", async () => {

        // log in a user
    let res = await request(app).post('/login').send({
        username: test_user.username,
        password: test_user.password
    });

    // add an item
     await request(app).post(`/carts/${test_user.username}/add`)
         .send({ product_id: test_product_id, _token:res.body._token })

        //  make an order
        let result = await request(app).post(`/orders/${test_user.username}/order`)
            .send({ _token: res.body._token })

        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty('message', 'order submitted')
    })

    test("submit order, authentication failure", async () => {

        // log in a user
    let res = await request(app).post('/login').send({
        username: test_user.username,
        password: test_user.password
    });

    // add an item
     await request(app).post(`/carts/${test_user.username}/add`)
         .send({ product_id: test_product_id, _token:res.body._token })

        //  make an order
        let result = await request(app).post(`/orders/${test_user.username}/order`)
            .send({  })

        expect(result.statusCode).toEqual(401)
        expect(result.body).toHaveProperty('message', 'You must authenticate first.')
    })

    test("submit order, autherization failure", async () => {

        // log in a user
    let res = await request(app).post('/login').send({
        username: test_user_two.username,
        password: test_user_two.password
    });

    // add an item
     await request(app).post(`/carts/${test_user.username}/add`)
         .send({ product_id: test_product_id, _token:res.body._token })

        //  make an order
        let result = await request(app).post(`/orders/${test_user.username}/order`)
            .send({ _token: res.body._token  })

        expect(result.statusCode).toEqual(401)
        expect(result.body).toHaveProperty('message', 'You are not authorized.')
    })



})

describe("get order history", () => {

    test('success, order history for test_user', async () => {

           // log in a user
    let res = await request(app).post('/login').send({
        username: test_user.username,
        password: test_user.password
    });

    // add an item
     await request(app).post(`/carts/${test_user.username}/add`)
         .send({ product_id: test_product_id, _token:res.body._token })

        //  make an order
        let result = await request(app).post(`/orders/${test_user.username}/order`)
            .send({ _token: res.body._token })

        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty('message', 'order submitted')

        // get the order history
        let orders = await request(app).post(`/orders/${test_user.username}/order-history`)
            .send({ _token: res.body._token })


        expect(orders.statusCode).toEqual(200)
        expect(orders.body[0]).toHaveProperty('product_id',test_product_id)
    })

    test('order history, authorization failure', async () => {

        // get the order history
        let orders = await request(app).post(`/orders/${test_user.username}/order-history`)
            .send({ })


        expect(orders.statusCode).toEqual(401)
        expect(orders.body).toHaveProperty('message', 'You must authenticate first.')
    })
    test('order history, authentication failure', async () => {

              // log in a user
    let res = await request(app).post('/login').send({
        username: test_user.username,
        password: test_user.password
    });
        // get the order history
        let orders = await request(app).post(`/orders/${test_user_two.username}/order-history`)
            .send({ _token:res.body._token })


        expect(orders.statusCode).toEqual(401)
        expect(orders.body).toHaveProperty('message', 'You are not authorized.')
    })
})