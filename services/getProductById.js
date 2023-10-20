
const Cart = require('../models/cart');

const getProductById = async (productId) => {

    try {
        const cart = await Cart.findOne({ 'products.product': productId });
        if (!cart) {
            return null;
        }
        const product = cart.products.find(p => p.product.toString() === productId.toString()).product;
        return product;
    } catch (error) {
        console.error(`Error getting product by ID: ${error.message}`);
        return null;
    }
};
module.exports = { getProductById };