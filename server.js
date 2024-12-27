const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = 3001; // You can change this port if necessary

// Middleware
app.use(express.json()); // Allows processing JSON requests
app.use(cors()); // Enables cross-origin requests (useful for communication between the frontend and backend)

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'wissalfrihi444@gmail.com', 
    pass: 'vxcg tfam kzks gywh',   // Use an app-specific password for better security
  },
});

app.post('/api/sendOrderConfirmationEmail', async (req, res) => {
    const { userName, userEmail, totalQty, totalAmount, address, phoneNumber } = req.body; // Récupération de l'adresse et du numéro de téléphone

    // First email to the customer
   // First email to the customer
const customerMailOptions = {
  from: '"Glamory" <wissalfrihi444@gmail.com>', // Corrected "from" format
  to: userEmail, // Customer's email
  subject: 'Order Confirmation',
  html: `
    <p>Thank you for your order, ${userName}!</p>
    <p>Total quantity: ${totalQty}</p>
    <p>Total price: ${totalAmount} DT</p>
    <p>Your order has been confirmed. We will process it shortly.</p>
    <p><strong>Delivery Address:</strong> ${address}</p>
    <p><strong>Contact Phone Number:</strong> ${phoneNumber}</p>
  `,
};

// Second email for you (the administrator)
const adminMailOptions = {
  from: '"Glamory" <wissalfrihi444@gmail.com>', // Corrected "from" format
  to: 'wissalfrihi444@gmail.com', // Your own email address to receive notifications
  subject: `New order placed by ${userName}`,
  html: `
    <h3>New order received!</h3>
    <p><strong>Customer name:</strong> ${userName}</p>
    <p><strong>Customer email:</strong> ${userEmail}</p>
    <p><strong>Total quantity:</strong> ${totalQty} items</p>
    <p><strong>Total price:</strong> ${totalAmount} DT</p>
    <p><strong>Delivery Address:</strong> ${address}</p>
    <p><strong>Contact Phone Number:</strong> ${phoneNumber}</p>
    <p><strong>Order date and time:</strong> ${new Date().toLocaleString()}</p>
    <br>
    <p>Please ensure that the order is processed promptly.</p>
    <p>Thank you,</p>
    <p>Your e-commerce system</p>
  `,
};

    try {
      // Sending the email to the customer
      await transporter.sendMail(customerMailOptions);
      console.log('Confirmation email sent to the customer');
  
      // Sending the email to the administrator
      await transporter.sendMail(adminMailOptions);
      console.log('Order alert email sent to the administrator');
  
      res.status(200).send('Emails were sent successfully');
    } catch (error) {
      console.error("Error sending emails:", error);
      res.status(500).send("Error sending emails");
    }
});

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
