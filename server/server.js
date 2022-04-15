require("dotenv").config()

const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json())
//app.use(express.static("public"))//only in same url
//make so that able to accept post request from 5500 port
app.use(
  cors({
    origin: "http://localhost:5500",
  })
)

//setup stripe
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

//price of item
const storeItems = new Map([
  [1, { priceInCents: 10000, name: "Learn React Today" }],
  [2, { priceInCents: 20000, name: "Learn CSS Today" }],
])

app.post("/create-checkout-session", async (req, res) => {
  try {
    ///stripe.checkout.sessions.create = create object 
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment", //can be payment or subscription
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id)
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        }
      }),
      success_url: `${process.env.CLIENT_URL}/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    })
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.listen(3000)
