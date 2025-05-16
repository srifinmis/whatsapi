require("dotenv").config();
const express = require("express");
const getCustomerOutstanding = require("./Queries/getCustomerOutstanding");
const bodyParser = require('body-parser');
const { handleUpiPayment } = require('./upiController');
const app = express();
const port = 3003;

app.use(bodyParser.json());

// Token authentication middleware
function authenticateToken(req, res, next) {
  const token = req.headers['x-api-token'];
  const VALID_TOKEN = process.env.API_TOKEN;

  if (!token || token !== VALID_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });
  }

  next();
}

// Protected route: UPI payment response
app.post('/api/upi-payment', authenticateToken, handleUpiPayment);

// Protected route: Get customer outstanding
app.get("/api/customer-outstanding", authenticateToken, async (req, res) => {
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
      EWI: result.emi_amt,
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
