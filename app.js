require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require("./model/blog");

const userRouter = require("./routers/user");
const blogRouter = require("./routers/blog");
const { checkForAutheticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 8000;

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Database Connected 🚀");
    })
    .catch((e) => {
        console.log(e.message);
    });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAutheticationCookie("token"));
app.use(express.static(path.resolve("./public")));
app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
