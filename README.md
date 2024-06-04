# Take home project

This is a simple e-commerce application that a customer can use to purchase a book. The code for this app was originally not setup for pamyents but since has been added and the original code remains [here](https://github.com/mattmitchell6/sa-takehome-project-node).

## Candidate instructions

You'll receive these in email.

## Application overview

This demo is written in Javascript (Node.js) with the [Express framework](https://expressjs.com/). You'll need to retrieve a set of testmode API keys from the Stripe dashboard (you can create a free test account [here](https://dashboard.stripe.com/register)) to run this locally.

We're using the [Bootstrap](https://getbootstrap.com/docs/4.6/getting-started/introduction/) CSS framework. It's the most popular CSS framework in the world and is pretty easy to get started with — feel free to modify styles/layout if you like.

To simplify this project, we're also not using any database here, either. Instead `app.js` includes a simple switch statement to read the GET params for `item`.

## Local Development Setup

For below instructions you will need vscode and docker installed on your machine.

1. Clone the repository to your local machine
   ```bash
   git clone https://github.com/sl-NZ/bookshop
   cd bookshop
   ```
2. Open the repository folder `bookshop` using vscode
3. Open the command palette (`Cmd+Shift+P` or `F1`) and run the command `>Dev Containers: Rebuild and Reopen in Container`
4. This will reopen the project in a docker container with all the required dependencies installed, this may take some time the first time as it will download the required docker images.
5. Once the container is up and running, creaate a `.env` file similar to the `sample.env` file and add your stripe test API keys from the [stripe dashboard](https://dashboard.stripe.com)
6. You can start the application by Run --> Start Debugging or `F5` or by running the below command in the terminal.

   ```bash
   npm start
   ```

   - The app starts on port 3000 and debug port 9229
   - Dev container is setup for full debugging capabilities

7. Navigate to [http://localhost:3000](http://localhost:3000) to view the index page.

## How does the Solution Work
Solutions presented where the user can select a single book to purchase from the landing page of the Stripe Press program. 

The user can select a book by clicking on the purchase button. The purchase button will trigger the stripe checkout flow which loads the stripe checkout modal on the checkout page. Additionally the checkout page has two additional form items to collect the user's name and email address. The user can then enter their payment details and complete the purchase within the stripe modal window.

The user can then enter their payment details and complete the purchase

### Architecture Sequence Diagram

![Architecture Sequence Diagram](/docs/img/stripe_bookshop_architecture.png)

### SL Notes

#### Reference Links

- https://docs.stripe.com/payments/quickstart?lang=node&client=html
- https://docs.stripe.com/payments/elements
- https://docs.stripe.com/api/payment_intents/create
- https://docs.stripe.com/js/elements_object/create_payment_element
- https://docs.stripe.com/js/elements_object/create_payment_element
- https://docs.stripe.com/js/payment_intents/confirm_payment
- https://github.com/stripe-samples/accept-a-payment/blob/main/payment-element/server/node/server.js
- https://docs.stripe.com/libraries/stripejs-esmodule
