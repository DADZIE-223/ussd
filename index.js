const express = require('express');
const crypto = require('crypto');
const app = express();

const PAYSTACK_SECRET = 'sk_live_a9dfd83efcc1addd939a8bbd985dde022a05a54c'; // Replace with your Paystack secret

app.use(express.json());

app.post('/paystack/webhook', (req, res) => {
  const hash = crypto.createHmac('sha512', PAYSTACK_SECRET)
                     .update(JSON.stringify(req.body))
                     .digest('hex');

  if (hash === req.headers['x-paystack-signature']) {
    const event = req.body;
    if (event.event === 'charge.success' && event.data.status === 'success') {
      const customerPhone = event.data.customer.phone;
      const amount = event.data.amount / 100;
      const reference = event.data.reference;

      console.log(`✅ Payment of ${amount} confirmed for ${customerPhone}, Ref: ${reference}`);
      // TODO: Trigger SMS, DB write, etc.
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
