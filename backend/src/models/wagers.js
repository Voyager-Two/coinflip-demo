import mongoose from "mongoose";

const wagerSchema = mongoose.Schema({
  id: { type: String },
  user_id: { type: String, required: true },
  amount_wagered: { type: Number, required: true },
  user_side: { type: String, required: true },
  coin_flip_result: { type: String, required: true },
  win: { type: Boolean, required: true },
  balance_before: { type: Number, required: true },
  balance_after: { type: Number, required: true },
  multiplier: { type: Number, required: true },
});

export default mongoose.model("Wagers", wagerSchema);
