



//   Model class for wishlist


const db = require("../db");
const ExpressError = require("../helpers/expressError")


class Wishlist{


    static async addToWishlist(user_id, product_id) {

        await db.query(`
            INSERT INTO wishlist
            (user_id, product_id)
            values($1, $2)
        `, [user_id, product_id])

    }



    static async removeFromWishlist(user_id, product_id) {

        let product = await db.query(`
            SELECT * from wishlist
            WHERE  user_id = $1 AND product_id = $2
        `, [user_id, product_id])

        if (product.rowCount === 0) throw new ExpressError('can not remove an item that does not exists', 404);

        await db.query(`
            DELETE FROM  wishlist
            where user_id = $1 AND product_id = $2
        `, [user_id, product_id])

    }

}


module.exports = Wishlist