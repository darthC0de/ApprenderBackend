const express = require('express');
const routes = express.Router();

const Questions = require('./controller/questions')

routes.get('/',(req,res)=>{
    return res.status(200).json({
        version: 1.2,
        message: "Created heroku app "
    });
});

routes.get('/questions',Questions.index)
routes.post('/questions',Questions.create)

module.exports = routes;