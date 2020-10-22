


//  Model class for cart


const db = require("../db");
const ExpressError = require("../helpers/expressError")


class Cart{


    //  * create a new cart
    static async makeCart(user_id) {
        // first check if the user has a  cart to his name
        const cart =await this.getCartId(user_id)
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

    static async addToCart(user_id, product_id) {

        //  1- check if there's a record with this product_id
        // : if there is no record:
            //  2- then get the cart id associated with that user.
            //  3 - make a new entry on items with this product id and the cart_id associated with the user and quantity +1;
        //  if there is a record:
        //      4- increase quantity by 1;
        const checkProduct = await db.query(
            `
            SELECT * from items
            WHERE product_id = $1
            `, [product_id]

        )
        if (checkProduct.rows.length === 0) {
            const cart_id = await this.getCartId(user_id)
            //  fill the items table
            const result = await db.query(

                `INSERT INTO items
                (cart_id, product_id, quantity)
                VALUES($1, $2, $3)
                `, [cart_id, product_id, 1]
            );

        } else {
            //  update the quantity
            // await db.query(

            // `UPDATE items
            // SET quantity = $1


            // `
            // )
        }
    }


    //  get cart id
    static async getCartId(user_id) {
        const result= await db.query(`
            SELECT id from carts
            WHERE user_id = $1
        `, [user_id]);

        return result.rows[0].id
    }



    //  add an item to a cart


    //  remove an item from a cart


    // destroy cart


}


module.exports = Cart