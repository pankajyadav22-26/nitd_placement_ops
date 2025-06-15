import mongoose from "mongoose";

const SingleOfferSchema = new mongoose.Schema({
    company_name: { type: String, required: true },
    type: {
        type: String,
        enum: ["intern", "intern+ppo", "intern+fte", "fte"],
        required: true,
    },
    ctc: { type: Number },
    stipend: { type: Number },
    is_ppo: { type: Boolean, default: false },
    non_blocking: { type: Boolean, default: false },
    offer_date: { type: Date, default: Date.now },
});

const OfferSchema = new mongoose.Schema({
    roll_no: { type: Number, required: true, unique: true },
    offers: [SingleOfferSchema],
    has_intern_offer: { type: Boolean, default: false },
    intern_blocked: { type: Boolean, default: false },
    fte_offer_count: { type: Number, default: 0 },
    highest_fte_ctc: { type: Number, default: 0 },
});

const OfferModel = mongoose.models.Offer || mongoose.model("Offer", OfferSchema);

export default OfferModel;