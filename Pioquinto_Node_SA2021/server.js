const express = require('express');
const request = require('request');
const mongoose = require('mongoose');
const People = require('./models/people');  
const {render} = require('ejs');
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'views')))
app.use(express.urlencoded({ extended: true }));
const dbURI = 'mongodb://piox:test12345@jerusalemcluster-shard-00-00.r3hvd.mongodb.net:27017,jerusalemcluster-shard-00-01.r3hvd.mongodb.net:27017,jerusalemcluster-shard-00-02.r3hvd.mongodb.net:27017/Timezone?ssl=true&replicaSet=atlas-x1s2ys-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(8080))
    .catch((err) => console.log(err));
app.set('view engine', 'ejs')

function timeanddate(objects)
{
    var timeFormat =    
    {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        timeZone: objects["timezone"]
    }

    var dateFormat = 
    {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: objects["timezone"]
    }

    var datetime = new Date(objects["datetime"])

    var date = new Intl.DateTimeFormat('en-US', dateFormat).format(datetime)
    var time = new Intl.DateTimeFormat('en-US', timeFormat).format(datetime)

    return [time, date];
}
function nationDetector (place) {
    if (place == "Asia/Tokyo") {
        nationality = "Japanese";
        banner = "Tokyo.png";
    } else if (place == "Asia/Seoul") {
        nationality = "Korean";
        banner = "Seoul.png";
    } else if (place == "Asia/Macau") {
        nationality = "Chinese";
        banner = "Macau.png";
    } else if (place == "Asia/Singapore") {
        nationality = "Singaporean";
        banner = "Singapore.png";
    } else if (place == "Asia/Manila") {
        nationality = "Filipino";
        banner = "Philippines.png";
    }
}

console.dir(app.locals.date)
console.dir(app.locals.nationality)
console.dir(app.locals.search)
app.get('/personlist', (req, res) => {
    request('http://worldtimeapi.org/api/timezone/'+search.location, function(error, response, body) {
        const info = JSON.parse(body)
        information = timeanddate(info)
        nationDetector(search.location) 
        People.find()
            .then((result) => {
                res.render('personlist', {title: 'Person List', time: information[0], date: information[1], people: result, flags: banner})
            })
            .catch((err) => {
                console.log(err);
            })
    })
    console.log(search.location)
});
app.get('/', function(req, res) {   
    res.render('', {title: 'Home'})
});
app.post('/personlist', (req, res) => {
    search = req.body
    res.redirect('personlist')    
});
app.post('/insert', (req, res) => {
    const people = new People(req.body);
    console.log(req.body);

    people.save()
    .then((result) => {
        res.redirect('personlist')
    })
    .catch((err) => {
        console.log(err);
    })
});
app.get('/newperson', function (req, res) {
    res.render('newperson', {title: 'New Person', nationality: nationality});
});
app.get('/viewperson/:id', (req, res) => {
    const id = req.params.id;
    People.findById(id)
    .then((result) => {
        console.log(result)
        res.render('viewperson', {title: 'View Person', people : result})
    }).catch((err) => {
        console.log(err);
    })
});
app.post('/spectacle', (req, res) => {
    res.render('viewperson');
});
