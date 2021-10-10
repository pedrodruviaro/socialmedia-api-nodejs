const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

// routes
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");

dotenv.config();
const app = express();
const uri = process.env.MONGO_URI;
const port = process.env.PORT || 8800;

// middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);

mongoose.connect(uri, () => {
    console.log("Connected to mongo!");
    app.listen(port, () => console.log("Server running!"));
});
