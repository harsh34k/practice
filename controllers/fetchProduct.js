
const axios = require('axios');

async function fetchProducts() {
    const response = await axios.get('https://fakestoreapi.com/products?limit=20');
    return response.data;
}

module.exports = {
    fetchProducts,
};
