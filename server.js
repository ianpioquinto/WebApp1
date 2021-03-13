const express = require('express');
const weather = require('weather-js');
const app = express();
const path = require('path')
app.use(express.static(path.join(__dirname, 'views', 'assets')))

app.set('view engine', 'ejs')

app.listen(3000)

app.use((req, res, next) => {
    console.log('Request Made');
    console.log(`Host: ${req.hostname}`);
    console.log(`Path: ${req.path}`);
    console.log(`Method: ${req.method}`);
    next();
});

app.get('/', function (req, res) {
    weather.find({search: 'Davao, PH', degreeType: 'C'}, function(err, result) {
        if(err) {
            console.log(err);
            res.render('index', {heading: 'New Heading', weather: 'Nothing'})
        } else {
            res.render('index', {heading: 'New Heading', weather: result})
        } 
    });
});