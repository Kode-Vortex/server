import express from "express";
import Razorpay from "razorpay";
import Payment from "../models/Payment.js"
const router = express.Router();


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});



router.post("/create-order", async (req,res) => {
    console.log(req.body);
    
    const { fullName , whatsappPhone,email,year,collegeName,stream, workshopSelection } = req.body.formData;
    const {amount} = req.body;
    console.log(fullName , whatsappPhone,email,year,collegeName,stream, workshopSelection , amount);
    

  if (!fullName || !whatsappPhone || !email || !year || !collegeName || !stream || !workshopSelection || !amount)
    return res.status(400).json({ success: false, message: "Missing fields" });

  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    
    const newPayment = {
      fullName , whatsappPhone,email,year,collegeName,stream, workshopSelection,
      amount,
      currency: "INR",
      orderId: order.id,
    };


    res.json({ success: true, order , newPayment});
  } catch (error) {
    console.error("Razorpay error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post("/update-status", async (req,res) => {
     const { orderId, paymentId, status  , paymentData} = req.body;

  try {


    if(status != "paid"){
        return res.status(201).json({message : "payment failed!!"})
    }

    const {fullName , whatsappPhone,email,year,collegeName,stream, workshopSelection,
    amount} = paymentData;

     const newPayment = new Payment({
      fullName , whatsappPhone,email,year,collegeName,stream, workshopSelection,
      amount,
      currency: "INR",
      orderId: orderId,
      paymentId:paymentId,

      status: "paid",
    });

    

    await newPayment.save();
      


    
    res.json({ success: true, message: "Payment updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

export default router;
