

const { Router } = require("express");
const router = Router();
const Cart = require("../models/cart");
// const getProductById1 = require("../services/getProductById");


router.get("/", async (req, res) => {

    try {
        const allCartItems = await Cart.find({});
        // console.log(allCartItems);
        res.render("carts", {
            carts: allCartItems,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/orderSummary", async (req, res) => {
    const { productId, quantity, } = req.query;
    try {
        const product = await Cart.find({ "product.id": productId })


        const subtotal = parseInt(parseInt(product.price) * parseInt(quantity));
        const tax = subtotal * 0.1;
        const total = subtotal + tax;

        res.render("orderSummary", {
            product,
            quantity,
            subtotal,
            tax,
            total
        });
    } catch (error) {
        console.error(error);
        res.render("error", { message: "Something went wrong" });
    }
});

router.post("/", async (req, res) => {
    const { productId, quantity } = req.body;
    // console.log("hello", productId, quantity);

    try {

        const product1 = await Cart.findOne({ "product.id": productId })
        product1.quantity = quantity;
        await product1.save();
        const product = await Cart.find({ "product.id": productId })

        // console.log(product);
        if (!product) {
            throw new Error("Product not found");
        }

        // res.render("orderSummary", {
        //     product,
        //     quantity,
        //     subtotal,
        //     tax,
        //     total,
        // });
        res.redirect(`/cart/orderSummary?productId=${productId}&quantity=${quantity}`);
        // res.redirect(`/cart/orderSummary?productId=${productId}&quantity=${quantity}&subtotal=${subtotal}&tax=${tax}&total=${total}`);

    } catch (error) {
        console.error(error);
        res.render("error", { message: "Something went wrong" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await Cart.findByIdAndDelete(id);
        res.redirect("/cart");
    } catch (error) {
        console.error(error);
        res.render("error", { message: "Something went wrong" });
    }
});

module.exports = router;