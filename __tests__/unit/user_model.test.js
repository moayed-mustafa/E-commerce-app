


/** Testing User Model */

process.env.NODE_ENV === 'test'
const db = require('../../db')
const bcrypt = require("bcrypt");


const User = require('../../models/user')

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
     await User.register(user);

})
afterEach(async () => {
    await db.query('DELETE from users')
})
afterAll(async () => {
    await db.end()
})



describe('Test user Signup', () => {
    test('can register user successfuly', async () => {
        let data = {
            "username": "test2",
            "password": "123456",
            "first_name": "test2",
            "last_name": "user",
            "email": "test2_user@email.com",
            "address": "Main Beach Road, Abudhabi"
        }
        let result = await User.register(data);
        const validUser = await bcrypt.compare(data.password, result.password)
        expect(validUser).toEqual(true);


    })
    test('user registeration fails, duplicate user', async () => {
        let data = {
            "username": "test",
            "password": "123456",
            "first_name": "test",
            "last_name": "user",
            "email": "test_user@email.com",
            "address": "Main Beach Road, Abudhabi"
        }
        let result = await User.register(data);
        expect(result).toHaveProperty("message", "There already exists a user with username 'test")
        expect(result.status).toEqual(409);


    })
})
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
describe('Test user Login', () => {
    test('can log in user successfuly', async () => {
        let data  = {"username": "test",
            "password": "123456"
        }
        let result = await User.authenticate(data);
        expect(result.id).toEqual(expect.any(Number))


    })
    test('can\'t log in user, credentials error', async () => {

        let data  = {"username": "test",
        "password": "12345678"
    }
        let result = await User.authenticate(data);
        expect(result.message).toEqual("Invalid Credentials")
        expect(result.status).toEqual(401)


    })
})
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

describe('Get one user', () => {
    test('getting a user successfuly', async () => {
        let username=  "test"

        let result = await User.findOne(username);
        expect(result.first_name).toEqual(user.first_name)


    })
    test('getting a user failure, user does not exist', async () => {

        let username=  "tester"
        let result = await User.findOne(username);
        expect(result.message).toEqual("There exists no user tester")
        expect(result.status).toEqual(404)

    })
})
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

describe('Update user', () => {
    test('update a user successfuly', async () => {
        let data = {
            username: "new-user"
        }
        let result = await User.update(user.username, data);
        expect(result.username).toEqual(data.username)
    })
    test('update user failure, user does not exist', async () => {

        let data = {
            username: "new-user"
        }

        let result = await User.update("fake-name", data);
        expect(result.message).toEqual("There exists no user fake-name")
        expect(result.status).toEqual(404)


    })

})
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

describe('Delete user', () => {
    test('delete a user successfuly', async () => {
        let result = await User.remove(user.username);
        expect(result).toEqual('user deleted')
    })
    test('delete user failure, user does not exist', async () => {

        let result = await User.remove("fake-name");
        expect(result.message).toEqual("There exists no user fake-name")
        expect(result.status).toEqual(404)

    })

})