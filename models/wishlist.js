



//   Model class for wishlist


const db = require("../db");
const ExpressError = require("../helpers/expressError")


class Wishlist{


    static async getItems(user_id) {

        const result = await db.query(`
            SELECT product_id FROM
            wishlist
            WHERE user_id = $1
        `, [user_id])
        return result.rows

    }
    static async addToWishlist(user_id, product_id) {

        await db.query(`
            INSERT INTO wishlist
            (user_id, product_id)
            values($1, $2)
        `, [user_id, product_id])
        return {message: 'Added item from wishlist'}

    }



    static async removeFromWishlist(user_id, product_id) {

        let product = await db.query(`
            SELECT * from wishlist
            WHERE  user_id = $1 AND product_id = $2
        `, [user_id, product_id])

        if (product.rowCount === 0) return new ExpressError('can not remove an item that does not exists', 404);

        else {
            await db.query(`
                DELETE FROM  wishlist
                where user_id = $1 AND product_id = $2
            `, [user_id, product_id])

            return {message: 'Removed item from wishlist', status:200}

        }
    }


}


module.exports = Wishlist