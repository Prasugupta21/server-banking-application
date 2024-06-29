require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB=require('./connection/db');
const cookieParser=require('cookie-parser');

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


connectDB();

const transactionRoutes = require('./routes/transaction');
const userRoutes = require('./routes/user');
app.use('/transaction', transactionRoutes);
app.use('/',userRoutes);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
