/** Shared config for application; can be req'd many places. */


require("dotenv").config();

const SECRET = process.env.SECRET_KEY || 'victoria';

const PORT = +process.env.PORT || 3001;



let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = "ecommercetest";
} else {
  DB_URI  = process.env.DATABASE_URL || 'ecommerce';
}

// console.log("Using database", DB_URI);

module.exports = {
  SECRET,
  PORT,
  DB_URI,
};
