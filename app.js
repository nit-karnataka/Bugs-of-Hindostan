const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const db = require('./db');

const models = require('./models');

const CONFIG = require('./config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

app.post('/create', (req,res,next) => {
    var user = new models.User();
    
    user.name = req.body.name;
    user.password = req.body.password;
    user.email = req.body.email;

    user
        .save()
        .then(() =>{
            res.send('Success');
        })
        .catch(err => {
            console.log(`Error: ${err}`);
        })
})

app.listen(CONFIG.SERVER.PORT, ()=>{
    console.log(`Server Started at http://localhost:${CONFIG.SERVER.PORT}/`);
})