const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

var app = express();

// view engine setup (Handlebars)
app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({}));

/**
 * Home route
 */
app.get("/", function (req, res) {
  res.render("index");
});

/**
 * Checkout route
 */
app.get("/checkout", function (req, res) {
  // Just hardcoding amounts here to avoid using a database
  const item = req.query.item;
  let title, amount, error;

  switch (item) {
    case "1":
      title = "The Art of Doing Science and Engineering";
      amount = 2300;
      break;
    case "2":
      title = "The Making of Prince of Persia: Journals 1985-1993";
      amount = 2500;
      break;
    case "3":
      title = "Working in Public: The Making and Maintenance of Open Source";
      amount = 2800;
      break;
    default:
      // Included in layout view, feel free to assign error
      error = "No item selected";
      break;
  }

  res.render("checkout", {
    title: title,
    amount: amount,
    error: error,
    stripePublicKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

/**
 * Success route
 */
app.get("/success", async function (req, res) {
  const { payment_intent } = req.query;

  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

  console.log(paymentIntent);

  // Convert amount from cents to dollars
  const amountInDollars = (paymentIntent.amount / 100).toFixed(2);
  const currency = paymentIntent.currency.toUpperCase();
  const bookTitle = paymentIntent.metadata.book_title;

  res.render("success", {
    payment_intent,
    amountInDollars,
    currency,
    bookTitle,
  });
});

/**
  // Calculate the amount to be paid per item and return it to the client
 * @param {*} items 
 * @returns amount to be charged
 */
const calculateOrderAmount = (items) => {
  let amount;
  switch (items[0].id) {
    case "1":
      amount = 2300;
      break;
    case "2":
      amount = 2500;
      break;
    case "3":
      amount = 2800;
      break;
    default:
      amount = 0;
      break;
  }

  return amount;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items, title } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "nzd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      book_title: title,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

/**
 * Start server
 */
app.listen(3000, () => {
  console.log("Getting served on port 3000");
});
