const express = require('express');
const cors = require('cors');
const app = express();

const dotenv = require('dotenv');
dotenv.config()

const routes = require('./routes');


app.use(express.json())
app.use(cors())
app.use(routes)


module.exports = app;
