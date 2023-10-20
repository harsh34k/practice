const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../services/auth");

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: "https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png",
    },
    role: {
        type: String,
        enum: ["USER", 'ADMIN'],
        default: "USER",
    },
    salt: {
        type: String,
        // required: true,
    },
}, { timestamps: true })

// hashing the password and generating salt;
userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) return;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");
    this.salt = salt;
    this.password = hashedPassword;
    next();
})


//matching password and genrating token

userSchema.static("validatePasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("user doesn't exists");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvideHash = createHmac("sha256", salt).update(password).digest("hex");

    if (!(hashedPassword === userProvideHash))
        throw new Error("Password is wrong");

    // console.log(User.find());
    const token = createTokenForUser(user);
    return token;
})



const User = model("user", userSchema);
module.exports = User;