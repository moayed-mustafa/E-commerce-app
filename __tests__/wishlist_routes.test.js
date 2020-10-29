

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
    await db.query('DELETE FROM wishlist')


})
afterAll(async () => {
    await db.end()
})


describe('Add to wishlist', () => {
    test('add to wishlist successfuly', async () => {
        //  log in a user
        let res = await request(app).post('/login').send({
            username: test_user.username,
            password: test_user.password
        });

        let result = await request(app).post(`/wishlist/${test_user.username}/add`)
            .send({ _token: res.body._token })

        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty('message', 'item added to wishlist')

    })

    test('add tp wishlist, authentication failure ', async () => {


        let result = await request(app).post(`/wishlist/${test_user.username}/add`)
            .send({ })

        expect(result.statusCode).toEqual(401)
        expect(result.body).toHaveProperty('message', 'You must authenticate first.')

    })
    test('add to wishlist, autherization failure', async () => {
        //  log in a user
        let res = await request(app).post('/login').send({
            username: test_user.username,
            password: test_user.password
        });

        let result = await request(app).post(`/wishlist/${test_user_two.username}/add`)
            .send({ _token: res.body._token })

        expect(result.statusCode).toEqual(401)
        expect(result.body).toHaveProperty('message', 'You are not authorized.')

    })
})

describe('Remove from wishlist', () => {
    test('remove from wishlist successfuly', async () => {
        //  log in a user
        let res = await request(app).post('/login').send({
            username: test_user.username,
            password: test_user.password
        });

        // add an item to wishlist first
        let add= await request(app).post(`/wishlist/${test_user.username}/add`)
        .send({ _token: res.body._token })

        expect(add.statusCode).toEqual(200)
        // remove it
        let result = await request(app).post(`/wishlist/${test_user.username}/remove`)
            .send({ _token: res.body._token })


        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty('message', 'item removed from wishlist')

    })

    test('remove from wishlist, failure because item does not exist in wishlist', async () => {
        //  log in a user
        let res = await request(app).post('/login').send({
            username: test_user.username,
            password: test_user.password
        });

        let result = await request(app).post(`/wishlist/${test_user.username}/remove`)
            .send({ _token: res.body._token })

        expect(result.statusCode).toEqual(404)
        expect(result.body).toHaveProperty('message', 'can not remove an item that does not exists')

    })

    test('remove from wishlist, authentication failure ', async () => {


        let result = await request(app).post(`/wishlist/${test_user.username}/remove`)
            .send({ })

        expect(result.statusCode).toEqual(401)
        expect(result.body).toHaveProperty('message', 'You must authenticate first.')

    })
    test('remove from wishlist, autherization failure ', async () => {
        //  log in a user
        let res = await request(app).post('/login').send({
            username: test_user.username,
            password: test_user.password
        });

        let result = await request(app).post(`/wishlist/${test_user_two.username}/remove`)
            .send({ _token:res.body._token})

        expect(result.statusCode).toEqual(401)
        expect(result.body).toHaveProperty('message', 'You are not authorized.')

    })
})