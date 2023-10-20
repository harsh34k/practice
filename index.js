const express = require("express");
const app = express();
const path = require("path");
const PORT = 9000;
const ProductRoute = require("./routes/product")
const UserRoute = require("./routes/user")
const CartRoute = require("./routes/cart")
const mongoose = require("mongoose")
const { fetchProducts } = require('./controllers/fetchProduct');
const { validateToken } = require('./services/auth');

const cookieParser = require("cookie-parser");
const Cart = require("./models/cart");
const methodOverride = require("method-override");

app.set("view engine", 'ejs');
app.set("views", path.resolve("./views")),
    app.use('/assets/images/', express.static('./assets/images'));

//adding mongodb
mongoose.connect("mongodb://127.0.0.1:27017/ecommy", { useNewUrlParser: true, useUnifiedTopology: true })

//urlencode middelware
app.use(cookieParser());
app.use(methodOverride("_method"));


app.use(
    express.urlencoded({ extended: false })
)

//middelwares

//example model 




app.use(async (req, res, next) => {
    try {
        const productModel = await fetchProducts();
        res.locals.productModel = productModel;
        // console.log("productModel", productModel);
        next();
    } catch (error) {
        console.log("error", error);
        res.render("error");
    }
});

app.use(async (req, res, next) => {
    try {
        // console.log(req.cookies);
        const user = await validateToken(req.cookies.token)
        if (user)
            res.locals.user = user;
        next();
    } catch (error) {
        // console.log("error", error);
        res.redirect("/");
    }
});
app.use(async (req, res, next) => {
    try {
        const count = await Cart.countDocuments({});
        console.log("count", count);
        res.locals.countCartItems = count;
        next();
    } catch (error) {
        console.log("error", error);
        res.render("error");
    }
});

//route

// {
//     id: 1,
//     title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
//     price: 109.95,
//     description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
//     category: "men's clothing",
//     image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
//     rating: { rate: 3.9, count: 120 }
//   },


// app.get("/", async (req, res) => {
//     let searchTerm = req.query.search;
//     searchTerm = searchTerm.toString().toLowerCase();

//     const searchedPosts = res.locals.productModel.filter(productModel => {
//         return productModel.title.toLowerCase().includes(searchTerm) || productModel.category.toLowerCase().includes(searchTerm);
//     });

//     console.log(searchedPosts);
//     res.render("home", {
//         searchedPosts
//     });
// })

app.get("/", async (req, res) => {
    let searchTerm = req.query.search;
    let searchedPosts = [];

    if (searchTerm) {
        searchTerm = searchTerm.toString().toLowerCase();

        const searchedPosts = res.locals.productModel.filter(productModel => {
            return productModel.title.toLowerCase().includes(searchTerm) || productModel.category.toLowerCase().includes(searchTerm);
        });

        console.log(searchedPosts);
        res.render("home", {
            searchedPosts
        });
    }
    res.render("home", {
        searchedPosts
    });

});


// product get
app.use("/product", ProductRoute);

//signup and signin
app.use("/user", UserRoute);

//add to cart
app.use("/cart", CartRoute);




app.listen(PORT, () => console.log(`server started at http://localhost:${PORT}/`));
