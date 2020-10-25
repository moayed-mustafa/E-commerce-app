



//  Model class for cart


const db = require("../db");
const ExpressError = require("../helpers/expressError")
const Cart = require('./cart')

class Order{

    static async createOrder(user_id) {



        const result = await db.query(`
            INSERT INTO orders
            (user_id) values($1)
            RETURNING id as order_id
        `, [user_id])
            if(!result) return new ExpressError('inserting into orders wernt wrong', 404)

        console.log(result.rows[0])
        const {order_id} = result.rows[0]
        console.log(order_id)

        // get the cart_id
        const cartResult = await Cart.getCartId(user_id)


        if(!cartResult) return new ExpressError('selecting from carts wernt wrong', 404)
        console.log('Logging cart result:')
        console.log(cartResult)
        const cart_id = cartResult[0].id;
        console.log(cart_id)
        //  insert into items
        await db.query(`
        UPDATE items
        SET order_id = $1
        WHERE cart_id = $2
        `, [order_id, cart_id])

        //  nullify the cart_id on items
        await db.query(`
        UPDATE items
        SET cart_id = $1
        WHERE cart_id = $2
        `, [null, cart_id])








    }

}


module.exports = Order