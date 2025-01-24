// external imports
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require('cors');
const bodyParser = require('body-parser');


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
// Set trust proxy based on environment
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // Trust first proxy
  } else {
    app.set('trust proxy', false); // Do not trust proxy in development
  }

// cors configuration
// app.use(cors(
//     {
//         origin: process.env.CLIENT_URL,
//         credentials: true,
//     }
// ));

const allowedOrigins = ['https://biolink-lite.vercel.app', 'http://localhost:3000','https://biolinklite.com '];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));


// set static folder
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());

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
