// external imports
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

// internal imports
const {notfoundHandler,errorHandler} = require("./middlewares/common/errorHandler");

const registrationRouter = require("./routers/RegisterRouter");

// app configuration
const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// set static folder
app.use(express.static(path.join(__dirname, "public")));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup
// app.use("/", homeRouter);
app.use("/register", registrationRouter);
// app.use("/", );
// app.use("/", );
// app.use("/", );
// app.use("/", );

// 404 not found handler
app.use(notfoundHandler);

// default error handler
app.use(errorHandler);

app.listen(process.env.PORT, () =>{
    console.log(`Server started at ${process.env.SITE_URL}${process.env.PORT}`);
});