# Take home project

This is a simple e-commerce application that a customer can use to purchase a book. The code for this app was originally not setup for pamyents but since has been added and the original code remains [here](https://github.com/mattmitchell6/sa-takehome-project-node).

## Candidate instructions

You'll receive these in email.

## Application overview

This demo is written in Javascript (Node.js) with the [Express framework](https://expressjs.com/). You'll need to retrieve a set of testmode API keys from the Stripe dashboard (you can create a free test account [here](https://dashboard.stripe.com/register)) to run this locally.

We're using the [Bootstrap](https://getbootstrap.com/docs/4.6/getting-started/introduction/) CSS framework. It's the most popular CSS framework in the world and is pretty easy to get started with — feel free to modify styles/layout if you like.

To simplify this project, we're also not using any database here, either. Instead `app.js` includes a simple switch statement to read the GET params for `item`.

# Submission - Sanil

## Local Development Setup

**Prerequisites:**
- Visual Studio Code(VSCode)
- Docker

**Steps:**
1. Clone the repository to your local machine
   ```bash
   git clone https://github.com/sl-NZ/bookshop
   cd bookshop
   ```
2. Open the repository folder `bookshop` using vscode
3. Open the command palette (`Cmd+Shift+P` or `F1`) and run the command `>Dev Containers: Rebuild and Reopen in Container`
4. This will reopen the project in a docker container with all the required dependencies installed, this may take some time the first time as it will download the required docker images.
5. Once the container is up and running, create a `.env` file similar to the `sample.env` file and add your Stripe test API keys from the [Stripe Dashboard](https://dashboard.stripe.com)
6. You can start the application by Run --> Start Debugging or `F5` or by running the below command in the terminal.

   ```bash
   npm start
   ```

   - The app starts on port 3000 and debug port 9229
   - Dev container is setup for full debugging capabilities

7. Navigate to [http://localhost:3000](http://localhost:3000) to view the index page.

## How does the Solution Work
The solution allows users to select a single book to purchase from the landing page of the Stripe Press Bookshop.

The user can select a book by clicking on the purchase button. The purchase button will trigger the stripe checkout flow which loads the stripe checkout element on the checkout page. During the loading of the stripe checkout page a call is made to the apps backend to create a pamyent intent with stripe using `stripe.paymentIntents.create`. The payment intent is created with the amount of the book and the currency of the book including a metadata field with the book title. The payment intent is then returned to the frontend and the stripe element is loaded with the payment intent client secret.

The checkout page has two additional form items to collect the user's name and email address. The user can then enter their payment details and complete the purchase within the larger form by clicking the submit button. A `stripe.confirmPayment` call is made to stripe which includes the name and email address of the user that is retrieved from this form as well params from the stripe element.

During the `stripe.confirmPayment` call a `return_url` is set to the success endpoint. If the payment is successful the user is redirected to the success page with query params including a payment intent id. The success endpoint makes a call to the backend to retrieve the payment intent and the book title from the metadata field. This passed onto to render the success page then displays a success message with the book title and the payment intent id.

### Architecture Sequence Diagram

![Architecture Sequence Diagram](/docs/img/stripe_bookshop_architecture.png)

### Stripe APIs Used

**Backend uses:**

- `stripe.paymentIntents.create` to create a payment intent with the amount of the book and the currency of the book including a metadata field with the book title. This can be found in the `POST /create-payment-intent` endpoint. Reference to API docs is https://docs.stripe.com/api/payment_intents/create
- `stripe.paymentIntents.retrieve` to retrieve the current status of the payment intent. This is done as part of the endpoint `/success` call, which retrieves information and passes to frontend to display after successful pamyent. Reference to API docs is https://docs.stripe.com/api/payment_intents/retrieve

**Frontend uses via Stripe JS:**

- `stripe.elements` to create a payment element. Reference to API docs is https://docs.stripe.com/js/elements_object/create_payment_element. This is rendered using the clientSecret passed from backend.
- `stripe.confirmPayment` to confirm the payment. Reference to API docs is https://docs.stripe.com/js/payment_intents/confirm_payment. This is called when the user submits the payment form.
- `stripe.retrievePaymentIntent` to retrieve the payment intent and used to determine payment status. Reference to API docs is https://docs.stripe.com/js/payment_intents/retrieve_payment_intent. This is called when the checkout page loads.


## Solving this Problem
I took some time going over the problem statement by the team and the existing codebase, I decided to use the existing node project as a base and build on top of it. Based on my interpretation the outcome of the project was to ensure that a user should be able to select a book and purchase it through the stripe embedded checkout flow element on the checkout page and once a successful payment is made the confirmation of purchase including the retrieved stripe intent ID should be displayed on the success page. This made me think about the problem in 3 parts, namely `selection`, `checkout` and `success`

### Breakdown of the Problem
After some thought, I decided to break down the problem into multiple phases to help build out the solution. The five phases I came up with were:
   - **_Phase 1_**: Setup the project and get it running locally in a `dev container`. This included setting up the project in vscode dev container and running the project locally. This setup also included ensuring that the app could be debugged within the container.
   - **_Phase 2_**: `Selection` of a book and setting up a payment intent when then the user was redirected to the checkout page. At this point I decided that I needed learn more about some of the basic stripe payment flows and seeked through research a quickstart example, I primarily used the [Custom Payment flow](https://docs.stripe.com/payments/quickstart?lang=node&client=html) example found in the Stripe docs, as well as the idea of a payment intent as per diagram found in the [PaymentIntent](https://docs.stripe.com/payments/accept-a-payment?platform=web&ui=elements#web-create-intent) docs. I noted that as soon as the chekout page loads a payment intent is created on stripe and the returned secret is used to create the payment form on the client.
   - **_Phase 3_**: `Checkout` of the book and completing the payment. In my headspace this page was primarily about taking in the input required, that is credit card details and taking payment on stripes end. I focussed on just taking the payment on form submission in a simple scaffolding manner with minimum input from user to make this flow work initially. I did have trouble getting the `payment-form` element working in the `checkout.hbs` as there was a duplicate between the example code and what the stripe quickstart manual presented. Some re-factoring, and htlm/css/js debugging was required to get this working. This was more difficult of the areas though i focussed on ensuring to only getting the bear minimum working. I confirmed payment was coming through by viewing the stripe dashboard.
   - **_Phase 4_**: `Success` of the payment and displaying the confirmation. I thought this area as the final main page that the user had to visit. My thoughts on this was that if the payment was successful then it should direct the user to the success page. I noted that the `confirmPayment` call had a `return_url` parameter that could be set to the success page and the scaffolding code already had a route to the page with a templated render. I tested this flow and it worked. I went back to the brief of the problem statement and noted that the Stripe Payment Intent ID had to be displayed on the success page, and I noted that this was being passed a addition to `return_url` as query params so I used this value and passed it to the frontend to display when it rendered.
   - **_Phase 5_**: `Add more colour`. I approached the problem in doing the bare minimum to achieve the scaffolding of the core flow using the quickstart guide as a reference. In this final phase (5th) I decided to go through each of the previous areas and add more value in the flow. Example in the checkout flow previously email and name was not being passed so I decided that I would add these fields to the form and pass them to the stripe, I noted in the stripe dashboard that fraud scoring was lower with these values being passed. Simialrly the book title was created in the payment intent when the user got redirected to the checkout page and finally additionally outputs were retrieved from stripe to display on the success page.

### Challenges Faced
- I have not worked much in frontend code so it took me some time to understand to understand how client side and server code interacted with each other. 
- The architecture of the client side directly interacting with stripe API using JS was new to me and I had to spend some time understanding this, I found the the quickstart example helped.
- I had some trouble moving on from the checkout page to the success page when the submit button was pressed and that took some time to debug, i evenutally found that the quickstart example I had use had a form name `payment-form` but also there was another existing form called `payment-form` in the `checkout.hbs` file that was causing the issue as the `checkout.js` was not able to find the correct form to submit.
- Overall the code space is not something I am familiar with so a general interesting challenge but I really enjoyed thinking about the problem in terms of the ideal flow and the rules of engagmene between the client and server side when interacting with stripe.

### Future Improvements and Robustness
- **Service Layer for Backend Code**: Refactor the backend code into a service layer to make it more modular and testable.
- **Modern Frontend Framework**: Refactor the frontend code to use a modern framework like React, which Stripe supports.
- **Enhanced Validation**: Implement more robust validation throughout the flow, such as email validation.
- **Database Integration**: Store selected items and payment details in a database for persistence and future reference.
- **Webhook Integration**: Utilise Stripe webhooks to trigger events like sending confirmation emails to customers.
- **Cart System**: Implement a cart system to allow customers to purchase multiple books at once.
- **Additional Payment Methods**: Provide more payment methods and capture more customer information.
- **Optimised Checkout Flow**: Consider using Stripe-hosted pages or embedded forms to reduce client-side code
- **One-Click Checkout**: Implement one-click checkout for returning customers.
- **Security and Testing**: Conduct thorough testing and consider security implications for the setup.


### Documentation Used

- https://docs.stripe.com/payments/quickstart?lang=node&client=html
- https://docs.stripe.com/payments/elements
- https://docs.stripe.com/api/payment_intents/create
- https://docs.stripe.com/js/elements_object/create_payment_element
- https://docs.stripe.com/js/elements_object/create_payment_element
- https://docs.stripe.com/js/payment_intents/confirm_payment
- https://github.com/stripe-samples/accept-a-payment/blob/main/payment-element/server/node/server.js
- https://docs.stripe.com/libraries/stripejs-esmodule
- OpenAI GPT-4o was used in terms of guidance in troubleshooting, specifically around frontend knowledge gaps.