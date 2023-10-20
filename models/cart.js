const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    product: {
        id: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        image: { type: String, required: true }
    },

    quantity: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    },


}, { timestamps: true })





const Cart = model("cart", cartSchema);
module.exports = Cart;