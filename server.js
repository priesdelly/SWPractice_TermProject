const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

//Security
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp'); 

//Load env vars
dotenv.config({path: './config/config.env'});

//Connect to database
connectDB();

//Route
const auth = require("./routes/auth");

// const hospitals = require('./routes/hospitals');
// const appointments = require('./routes/appointments');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}));

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate Limiting
const limiter = rateLimit({
    windowsMs: 10 * 60 * 1000, //10 mins
    max: 100
});

app.use(limiter);

//Prevent http param pollutions
app.use(hpp());

const PORT = process.env.PORT || 5002;

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'FutureFist API',
            version: '1.0.0',
            description: 'FutureFist API'
        },
        servers: [
            {
                url: 'http://localhost:' + PORT + '/api/v1'
            }
        ],
    },
    apis: ['./routes/*.js'],
};


//Controller setup
app.use("/api/v1/auth", auth);

// app.use('/api/v1/hospitals', hospitals);
// app.use('/api/v1/appointments', appointments);

app.use('/', function (req, res) {
    res.redirect('/api-docs');
});

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(() => process.exit(1));
});
