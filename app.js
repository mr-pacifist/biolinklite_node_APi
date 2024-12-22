// external imports
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require('cors');
const cookieParser = require("cookie-parser");

// internal imports
const {notfoundHandler,errorHandler} = require("./middlewares/common/errorHandler");

const biolinkRouter = require("./routers/biolinkRouter");
const userRouter = require("./routers/userRouter");
const profileRouter = require("./routers/profileRouter");
const custom_linkRouter = require("./routers/custom_linkRouter");
const headerRouter = require("./routers/headerRouter");
const socialMediaRouter = require("./routers/socialMediaRouter");


// app configuration
const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// cors configuration
app.use(cors({
    origin: process.env.APP_URL,
    credentials: true
}));

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup
app.use("/", biolinkRouter);
app.use("/user", userRouter);
app.use("/profile", profileRouter );
app.use("/custom_link", custom_linkRouter);
app.use("/header", headerRouter);
app.use("/socialMedia", socialMediaRouter);


// 404 not found handler
app.use(notfoundHandler);

// default error handler
app.use(errorHandler);

app.listen(process.env.PORT, () =>{
    console.log(`Server started at ${process.env.APP_URL}${process.env.PORT}`);
});