DROP DATABASE IF EXISTS ecommerce;
CREATE DATABASE ecommerce;

\c ecommerce;

DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Carts;
DROP TABLE IF EXISTS WishList;
DROP TABLE IF EXISTS Orders;

CREATE TABLE Users (
   id SERIAL PRIMARY KEY,
   first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  password text UNIQUE,
  address text
);

CREATE TABLE Carts (
  id SERIAL PRIMARY KEY,
  user_id integer,
  product_id integer,
  product_price integer,
  product_img text,
  product_title text,
  quantity integer DEFAULT 1
);

CREATE TABLE Orders (
  id SERIAL PRIMARY KEY,
  user_id integer,
  cart_id integer,
  product_id integer,
  product_price integer,
  product_img text,
  product_title text,
  quantity integer DEFAULT 1
);

CREATE TABLE WishList (
  id SERIAL PRIMARY KEY,
  user_id integer,
  cart_id integer,
  product_id integer,
  product_price integer,
  product_img text,
  product_title text,
  quantity integer DEFAULT 1
);

ALTER TABLE Carts ADD FOREIGN KEY (user_id) REFERENCES Users (id);

ALTER TABLE Orders ADD FOREIGN KEY (user_id) REFERENCES Users (id);

ALTER TABLE Orders ADD FOREIGN KEY (cart_id) REFERENCES Carts (id);

ALTER TABLE WishList ADD FOREIGN KEY (user_id) REFERENCES Users (id);

ALTER TABLE WishList ADD FOREIGN KEY (cart_id) REFERENCES Carts (id);
