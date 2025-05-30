import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  availableSeats: { type: Number, required: true },
});

export default mongoose.model("Workshop", workshopSchema);
