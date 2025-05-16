require("dotenv").config();
const express = require("express");
const getCustomerOutstanding = require("./Queries/getCustomerOutstanding");
const bodyParser = require('body-parser');
const { handleUpiPayment } = require('./upiController');
const app = express();
const port = 3003;

app.use(bodyParser.json());

// POST API for receiving UPI payment response
app.post('/api/upi-payment', handleUpiPayment);

app.get("/api/customer-outstanding", async (req, res) => {
  const { customer_id, as_on_date } = req.query;

  if (!customer_id) {
    return res.status(400).json({ error: "Missing customer_id" });
  }

  try {
    const result = await getCustomerOutstanding(customer_id, as_on_date);

    if (!result) {
      return res.status(404).json({ message: "No data found" });
    }

    res.json({
      customer_id: result.customer_id,
      EWI:result.emi_amt,
      total_outstanding: parseFloat(result.total_overdue)
    });
  } catch (err) {
    console.error("Error fetching data from Athena:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
