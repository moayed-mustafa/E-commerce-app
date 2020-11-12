# Shopper

 - Shopper is an E-commerce app that makes it easy for people to buy products online.
    the app allows users to browse available products, browse by catgories,
    add something to theri wishlist to buy later or add it to cart and buy immediately.
- This repo has the backend api for the project.
- Live site: [Shopper](https://shopper-fe.herokuapp.com/)


 # User flow
 - the user can registe if not registered or login to the system.
 - homepage will show the available products that the user can click on to view a product.
 - users can add/remove  products to their cart.
 - users can add/remove products from their wishlist.
 - cart page will show all the products currently at the user's cart.
 - orders page will show the order history of the user.
 # Api
  The data for this project come from :
  [Fake Product Api](https://fakestoreapi.com/)

  Backend Api for this project is bulit using node and published via postman :
  [E-commerce backend](https://documenter.getpostman.com/view/11551288/TVYF8dyX)

  # Technologies:
   The project uses the following technologies:
   - Express JS
   - Postgresql
   - Nodemon
   - Jest
   - Postman
   - json web token
   - joi

   # Schema
   - Here you can take a look at the database schema design [database](https://dbdiagram.io/d)

   # Clone this project:
   - To run this backend Api on your local environment you need to clone it.
   - on your terminal, go to the directory and run the database file E-commerce.sql using: psql > E-commerce.sql
   - then run npm install to get the dependencies.
   - once everything is installed, you can start the server using : nodemon server.js.
   - you can start consuming the api using a REST client like Postman or Insomnia or on the command-line with CURL.
   - all routes and models for this project have been tested using jest.
   - to run tests, first run the test database : psql > E-commerce-test.sql
   - in the root of the project run : npm test.
    this will run all of the tests files.
    - you can also run tests individually using : jest name_of_the_test_file


   # Stratch Goals
   - make a recommendation system based on previous purchases.
   - remind users about products in their wishlist using an email service or whenever they visit the app.
   - use a third party billing service
   - make a return and refund feature
   - make a user complaint feature