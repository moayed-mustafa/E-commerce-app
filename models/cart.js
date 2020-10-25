


//  Model class for cart


const db = require("../db");
const ExpressError = require("../helpers/expressError")


class Cart{


    //  * create a new cart
    static async makeCart(user_id) {
        console.log("at the cart model", user_id)
        // first check if the user has a  cart to his name
        const cart = await this.getCartId(user_id)
        console.log(cart)
        if (cart.length > 0) return;
        else {
            await db.query(
                `INSERT INTO carts
                (user_id)
                values ($1)
                `,[user_id]
            )

        }
    }
    //  add an item to a cart

    static async addToCart(user_id, product_id) {

        const cart = await this.getCartId(user_id)

        let cart_id;
        const checkProduct = await db.query(
            `
            SELECT * from items
            WHERE product_id = $1
            `, [product_id]

        )
        if (checkProduct.rowCount === 0) {
            cart_id = cart[0].id
             await db.query(
                `INSERT INTO items
                (cart_id, product_id, quantity)
                VALUES($1, $2, $3)
                `, [cart_id, product_id, 1]
            );

        } else {
            cart_id = cart[0].id
            await db.query(

            `UPDATE items
            SET quantity = quantity + 1
            WHERE cart_id = $1
             `, [cart_id]
            )
        }
    }


        //  remove an item from a cart
    static async removeFromCart(user_id, product_id) {
        const cart = await this.getCartId(user_id)

        let cart_id;
        const checkProduct = await db.query(
            `
            SELECT quantity from items
            WHERE product_id = $1
            `, [product_id]

        )
        console.log(checkProduct.rows[0].quantity)
        if (checkProduct.rows[0].quantity === 1) {
            //  we want to delet the whole row
            cart_id = cart[0].id
             await db.query(
                `DELETE from items
                WHERE product_id = $1

                `, [product_id]
            );

        } else {
            //  we want to reduce it by 1
            cart_id = cart[0].id
            await db.query(

            `UPDATE items
            SET quantity = quantity - 1
            WHERE cart_id = $1
             `, [cart_id]
            )
        }

    }

    //  get cart id
    static async getCartId(user_id) {
        const result= await db.query(`
            SELECT id from carts
            WHERE user_id = $1
        `, [user_id]);
        return result.rows
    }




    // destroy cart
    static async destroyCart(user_id) {
        await db.query(`
        DELETE from carts
        WHERE user_id = $1
        `, [user_id])
    }


}


module.exports = Cart