

const request = require('supertest')
const app = require('../../app')

const User = require('../../models/user')

process.env.NODE_ENV === 'test'
const db = require('../../db')


// set up the test:
let test_user;
let _token;
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

     await User.register(test_user)
})

afterEach(async () => {
    await db.query('DELETE FROM users')

})
afterAll(async () => {
    await db.end()
})


describe('Sign up a user', () => {
    test('sign up a user, success', async () => {
        let test_user2 = {
            "username": "_test_",
            "password": "password",
            "first_name": "test_signup",
            "last_name": "mustafa",
            "email": "test_user_signup@gmail.com",
            "address": "Karama, 2nd Street, Dubai "
        }

        let result = await request(app).post('/users/signup').send(test_user2)
        expect(result.statusCode).toEqual(201)
        expect(result.body).toEqual(expect.anything())
    })

})

describe('/login', () => {
    test('log in a user, success', async () => {

        let result = await request(app).post('/login').send({
            username: test_user.username,
            password: test_user.password
        })
        expect(result.statusCode).toEqual(200)
        expect(result.body).toEqual(expect.anything())
    })

    test('log in a user, schema fail', async () => {

        let result = await request(app).post('/auth/login')
            .send({
                username: "a_long_name_that_wont_pass",
                password: test_user.password
            })
        expect(result.statusCode).toEqual(404)
    })

})

describe('GET/users', () => {
    test('get users, success', async () => {
        let res = await request(app).post('/login').send({
            username: test_user.username,
            password: test_user.password
        })

        let result = await request(app).get('/users')
        .send({ _token:res.body._token })
        expect(result.statusCode).toEqual(200)
    })
    test('get users, unauthorized', async () => {

        let result = await request(app).get('/users').send({})
        expect(result.statusCode).toEqual(401)
        expect(result.body).toHaveProperty("message", "You must authenticate first.")
    })

})

describe('GET/users/:username', () => {
    test('get one user, success', async () => {
        let res = await request(app).post('/login').send({
            username: test_user.username,
            password: test_user.password
        })

        let result = await request(app).get(`/users/${test_user.username}`)
            .send({ _token: res.body._token })
            expect(result.statusCode).toEqual(200)
    })
    test('get user, unauthorized', async () => {

        let result = await request(app).get(`/users/${test_user.username}`).send({})
        expect(result.statusCode).toEqual(401)
        expect(result.body).toHaveProperty("message", "You must authenticate first.")
    })

})


describe('PATHC/users/:username', () => {
    test('edit a user\'s username, success', async () => {
        let res = await request(app).post('/login').send({
            username: test_user.username,
            password: test_user.password
        })

        let result = await request(app).patch(`/users/${test_user.username}`).send({
            username: "new-user-name",
            _token: res.body._token
        })
        expect(result.statusCode).toEqual(200)
        expect(result.body.username).toEqual("new-user-name")
    })

    test('edit a user\'s , schema fail', async () => {
        let res = await request(app).post('/login').send({
            username: test_user.username,
            password: test_user.password
        })

        let result = await request(app).patch(`/users/${test_user.username}`).send({
            username: "123qweasdzxcrtyrytfghfhbvn",
            _token: res.body._token
        })
        expect(result.statusCode).toEqual(400)

        expect(result.body).toHaveProperty("message",
            '"username" length must be less than or equal to 18 characters long')

    })

    test('edit a user\'s password, success', async () => {
        let res = await request(app).post('/login').send({
            username: test_user.username,
            password: test_user.password
        })

        let result = await request(app).patch(`/users/${test_user.username}`)
            .send({
                password: "123qweasdzxc",
                _token: res.body._token
            })
        expect(result.statusCode).toEqual(200)
    })
    test('patch a user, unauthorized', async () => {

        let result = await request(app).patch(`/users/${test_user.username}`).send({})
        expect(result.statusCode).toEqual(401)
        expect(result.body).toHaveProperty("message", "You are not authorized.")
    })

})


describe("/DELETE/user/:username", () => {
    test("delete a user, success", async () => {
        let res = await request(app).post('/login').send({
            username: test_user.username,
            password: test_user.password
        })

        let result = await request(app).delete(`/users/${test_user.username}`)
            .send({ _token: res.body._token })

        expect(result.statusCode).toEqual(200);
        expect(result.body).toHaveProperty( "message", "User deleted" )

    })
    test("delete a user, fail", async () => {

        let fake_token = ".eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE2MDM4OTU2NjV9.G"
        let result = await request(app).delete(`/users/${test_user.username}`)
            .send({ _token:fake_token })

        expect(result.statusCode).toEqual(401);
        expect(result.body)
            .toHaveProperty("message", "You are not authorized.")

    })
})



