const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Firestore trigger function
exports.sendOrderConfirmationEmail = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    console.log(`Send email to ${order.email} with order details.`);
    // Add your email sending logic here
  });
