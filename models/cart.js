


//  Model class for cart


const db = require("../db");
const ExpressError = require("../helpers/expressError")


class Cart{


    //  * create a new cart
    static async makeCart(user_id) {
        // first check if the user has a  cart to his name
        const cart = await this.getCartId(user_id)
        if (cart.length > 0) return;
        else {
            await db.query(
                `INSERT INTO carts
                (user_id)
                values ($1)
                `,[user_id]
            )

        }
        return {message:"Cart Created."}
    }

    // get items currently in cart
    static async getItems(user_id, cart_id) {
        const result= await db.query(`
            SELECT product_id, quantity FROM items
            WHERE user_id = $1
            AND cart_id = $2
        `, [user_id, cart_id]);
        return result.rows
    }
    //  add an item to a cart

    static async addToCart(user_id, product_id) {
        const cart = await this.getCartId(user_id)

        let cart_id = cart[0].id;
        const checkProduct = await this.checkProduct(product_id, user_id, cart_id)
        if (checkProduct.rowCount === 0) {
            // cart_id = cart[0].id
             await db.query(
                `INSERT INTO items
                (cart_id, user_id, product_id, quantity)
                VALUES($1, $2, $3, $4)
                `, [cart_id, user_id, product_id, 1]
            );

        } else {
            // cart_id = cart[0].id
            await db.query(

            `UPDATE items
            SET quantity = quantity + 1
            WHERE product_id = $1
             `, [product_id]
            )
        }
        return {message:"Added to cart."}
    }


        //  remove an item from a cart
    static async removeFromCart(user_id, product_id) {
        const cart = await this.getCartId(user_id)
        let cart_id = cart[0].id;



        const checkProduct = await this.checkProduct(product_id, user_id, cart_id)


        if (checkProduct.rows.length === 0){
            return new ExpressError("can not remove an item that is not in cart", 404)
        }
        if (checkProduct.rows[0].quantity === 1) {
            //  delet the whole row

             await db.query(
                `DELETE from items
                WHERE product_id = $1

                `, [product_id]
            );

        } else {
            //  quantity -=1

            await db.query(

            `UPDATE items
            SET quantity = quantity - 1
            WHERE product_id = $1
             `, [product_id]
            )
        }
        return {message:"item removed", status: 200}

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
        return {message: "Deleted Cart."}

    }

    static async checkProduct(product_id, user_id, cart_id) {
        //  * the change I'm making now is just to replace the user_id with the cart_id
        //  * note that this change might change the bahaviour of remove from item
       return await db.query(
            `
            SELECT * from items
            WHERE product_id = $1
            AND user_id = $2
            AND cart_id = $3
            `, [product_id, user_id, cart_id]

        )
    }


}


module.exports = Cart