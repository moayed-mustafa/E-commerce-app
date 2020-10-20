DROP DATABASE IF EXISTS ecommerce;
CREATE DATABASE ecommerce;

\c ecommerce;

DROP TABLE users CASCADE ;
DROP TABLE  carts CASCADE;
DROP TABLE  wishlist CASCADE;
DROP TABLE  orders CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  password text UNIQUE,
  address text
);

CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id integer,
  product_id integer,
  product_price integer,
  product_img text,
  product_title text,
  quantity integer DEFAULT 1
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id integer,
  cart_id integer,
  product_id integer,
  product_price integer,
  product_img text,
  product_title text,
  quantity integer DEFAULT 1
);

CREATE TABLE wishlist (
  id SERIAL PRIMARY KEY,
  user_id integer,
  cart_id integer,
  product_id integer,
  product_price integer,
  product_img text,
  product_title text,
  quantity integer DEFAULT 1
);

ALTER TABLE carts ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE orders ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE orders ADD FOREIGN KEY (cart_id) REFERENCES carts (id);

ALTER TABLE wishlist ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE wishlist ADD FOREIGN KEY (cart_id) REFERENCES carts (id);
