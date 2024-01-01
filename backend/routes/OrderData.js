const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

router.post('/orderData', async (req, res) => {
  try {
    const userEmail = req.body.email;
    const orderData = req.body.order_data;

    // Find the user's existing order
    const existingOrder = await Order.findOne({ email: userEmail });

    if (!existingOrder) {
      // If no existing order, create a new order
      const newOrder = await Order.create({
        email: userEmail,
        order_data: [orderData], // Assuming order_data is an array
      });

      res.json({ success: true, order: newOrder });
    } else {
      // If an existing order is found, update it
      existingOrder.order_data.push(orderData); // Assuming order_data is an array
      await existingOrder.save();

      res.json({ success: true, order: existingOrder });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.post('/myOrderData', async (req, res) => {
  try {
    const myData = await Order.findOne({ email: req.body.email });
    //console.log("ishaan", myData);

    if (myData) {
      //console.log(myData.order_data);
      res.json({ OrderData: myData });
    } else {
      res.json({ OrderData: null });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
