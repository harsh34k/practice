const { Router } = require("express");
const User = require("../models/User");
const router = Router();

//signup
router.get("/signup", (req, res) => {

    res.render("signup")
})

router.post("/signup", (req, res) => {
    const { fullName, email, password, phoneNumber } = req.body;
    User.create({
        fullName: fullName,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
    })
    return res.redirect("/")
})

//signin
router.get("/signin", (req, res) => {
    res.render("signin")
})

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.validatePasswordAndGenerateToken(email, password)
        res.cookie("token", token);
        res.redirect("/")

    } catch (error) {
        console.log("error aya hai ek", error);

        res.render("signin", {
            error: "incorrect email or password"
        })
    }

})

//logout
router.get("/logout", (req, res, next) => {
    res.clearCookie("token").redirect("/")
})


module.exports = router;