import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  fullName: String,
  whatsappPhone: String,
  email: String,
  year:String,
  collegeName:String,
  stream : String,
  workshopSelection : String,
  currency: String,
  orderId: String,
  amount: Number,
  paymentId: String,
  status: {
    type: String,
    default: "created", // created | paid | failed
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
