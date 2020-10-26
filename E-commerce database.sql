DROP DATABASE IF EXISTS ecommerce;
CREATE DATABASE ecommerce;

\c ecommerce;

DROP TABLE users CASCADE ;
DROP TABLE  carts CASCADE;
DROP TABLE  wishlist CASCADE;
DROP TABLE  orders CASCADE;
DROP TABLE  items CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  password text,
  address text
);

CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id integer,
  product_id integer,
  quantity integer DEFAULT 0
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id integer,
  order_date date NOT NULL DEFAULT CURRENT_DATE
);


CREATE TABLE wishlist (
  id SERIAL PRIMARY KEY,
  user_id integer,
  cart_id integer,
  product_id integer
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  user_id integer,
  cart_id integer,
  order_id integer,
  product_id integer,
  quantity integer DEFAULT 0

);



ALTER TABLE carts ADD FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE orders ADD FOREIGN KEY (user_id) REFERENCES users (id)   ON DELETE CASCADE;

ALTER TABLE wishlist ADD FOREIGN KEY (user_id) REFERENCES users (id)  ON DELETE CASCADE;

ALTER TABLE wishlist ADD FOREIGN KEY (cart_id) REFERENCES carts (id)  ON DELETE CASCADE;

ALTER TABLE items ADD FOREIGN KEY (user_id) REFERENCES users (id)   ON DELETE CASCADE;

ALTER TABLE items ADD FOREIGN KEY (cart_id) REFERENCES carts (id)  ON DELETE CASCADE;

ALTER TABLE items ADD FOREIGN KEY (order_id) REFERENCES orders (id)  ON DELETE CASCADE;


