const pool = require("../db");

exports.handleUpiPayment = async (req, res) => {
  const responseData = req.body;

  try {
    await pool.query(
      `INSERT INTO public.upi_payments (response_payload) VALUES ($1)`,
      [responseData]
    );
    res.status(200).json({ message: "UPI response stored." });
  } catch (error) {
    console.error("Error inserting JSON response:", error);
    res.status(500).json({ error: "Failed to store UPI response." });
  }
};
