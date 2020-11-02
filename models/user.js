
// Models class for user

const db = require("../db");
const bcrypt = require("bcrypt");
const partialUpdate = require("../helpers/partialUpdate");
const ExpressError = require("../helpers/expressError")
const Cart = require('./cart')

const BCRYPT_WORK_FACTOR = 10;


class User{

    //* authenticate user with username, password. Returns user or throws err. */

  static async authenticate(data) {
    // try to find the user first
    const result = await db.query(
        `SELECT
                *
          FROM users
          WHERE username = $1`,
        [data.username]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(data.password, user.password);
      if (isValid) {
        //  * create a cart for the user
        await Cart.makeCart(user.id)
        return user;
      }
      else {
        return new ExpressError("Invalid Credentials", 401);
      }
    }

  }
//   ============================================================================================================================================================

    //* Register user with data. Returns new user data. */

  static async register(data) {

      const duplicateCheck = await db.query(
        `SELECT username
            FROM users
            WHERE username = $1`,
        [data.username]
    );

      if (duplicateCheck.rows[0]) {
       return new ExpressError(`There already exists a user with username '${data.username}`, 409);

    }

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
        `INSERT INTO users
            (username, password, first_name, last_name, email, address)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING username, password, first_name, last_name, email, address`,
        [
          data.username,
          hashedPassword,
          data.first_name,
          data.last_name,
          data.email,
          data.address
        ]);

      return result.rows[0];




  }
    //   ============================================================================================================================================================

     /** Find all users. */

  static async findAll() {
    const result = await db.query(
        `SELECT username, first_name, last_name, email
          FROM users
          ORDER BY username`);

    return result.rows;
  }

    //   ============================================================================================================================================================

     /** Find one user. */
  static async findOne(username) {
    const userRes = await db.query(
        `SELECT id, username, first_name, last_name, email
            FROM users
            WHERE username = $1`,
        [username]);

    const user = userRes.rows[0];

    if (!user) {

      return new ExpressError(`There exists no user ${username}`, 404)
    }

    return user;
  }

     //   ============================================================================================================================================================


  static async update(username, data) {

    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    let {query, values} = partialUpdate(
        "users",
        data,
        "username",
        username
    );

    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      return new ExpressError(`There exists no user ${username}`, 404)
    }

    delete user.password;

    return user;
  }
    //   ============================================================================================================================================================

     /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
            `DELETE FROM users
              WHERE username = $1
              RETURNING username`,
            [username]);

  if (result.rows.length === 0) {
    return new ExpressError(`There exists no user ${username}`, 404)
  }
    return 'user deleted'
}


}

module.exports = User;