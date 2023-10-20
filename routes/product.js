
// const generateGuestCartId = require("../services/generateGuestCartId")
const { Router } = require("express");
const Cart = require("../models/cart");
const router = Router();

// get 
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const currentProduct = await res.locals.productModel.find((product) => product.id == id);
    const CurrentItemInCart = await Cart.findOne({ "product.id": id });
    res.render("product", {
        product: currentProduct,
        CurrentItemInCart
    });
});

//post
router.post("/:id", async (req, res) => {
    const { id } = req.params;
    const currentProduct = await res.locals.productModel.find((product) => product.id == id);
    const CurrentItemInCart = await Cart.findOne({ "product.id": id });
    const currentUser = res.locals.user;
    if (!currentUser) {
        res.redirect("/user/signin")

    }
    else if (!currentProduct) {
        return res.render("404");
    }
    else {
        const cartItem = await Cart.create({
            user: currentUser.id,
            product: {
                id: id,
                title: currentProduct.title,
                description: currentProduct.description,
                price: currentProduct.price,
                image: currentProduct.image,
            },
            quantity: 1
        });
        // console.log(cartItem);

        res.redirect("/cart")
    }
});

module.exports = router;
