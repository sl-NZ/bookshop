# Take home project

This is a simple e-commerce application that a customer can use to purchase a book, but it's missing the payments functionality — your goal is to integrate Stripe to get this application running!

## Candidate instructions

You'll receive these in email.

## Application overview

This demo is written in Javascript (Node.js) with the [Express framework](https://expressjs.com/). You'll need to retrieve a set of testmode API keys from the Stripe dashboard (you can create a free test account [here](https://dashboard.stripe.com/register)) to run this locally.

We're using the [Bootstrap](https://getbootstrap.com/docs/4.6/getting-started/introduction/) CSS framework. It's the most popular CSS framework in the world and is pretty easy to get started with — feel free to modify styles/layout if you like.

To simplify this project, we're also not using any database here, either. Instead `app.js` includes a simple switch statement to read the GET params for `item`.

To get started, clone the repository and run `npm install` to install dependencies:

```
git clone https://github.com/mattmitchell6/sa-takehome-project-node && cd sa-takehome-project-node
npm install
```

Rename `sample.env` to `.env` and populate with your Stripe account's test API keys

Then run the application locally:

```
npm start
```

Navigate to [http://localhost:3000](http://localhost:3000) to view the index page.

### SL Notes

#### Reference Links

- https://docs.stripe.com/payments/quickstart?lang=node&client=html
- https://docs.stripe.com/payments/elements
- https://docs.stripe.com/api/payment_intents/create
- https://docs.stripe.com/js/elements_object/create_payment_element
- https://docs.stripe.com/js/elements_object/create_payment_element
- https://github.com/stripe-samples/accept-a-payment/blob/main/payment-element/server/node/server.js
- https://docs.stripe.com/libraries/stripejs-esmodule
