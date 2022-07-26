const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/Campground');
const methodOverride = require('method-override')


mongoose.connect('mongodb://localhost:27017/yelpCamp', {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
})

//app.get('/makecampground', async (req, res) => {
//  const camp = new Campground({ tittle: 'My Garden', description: 'Beautiful Flowers' });
//await camp.save();
//res.render('home')
//res.send(camp)
//})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    console.log(campground)
    res.render('campgrounds/show', { campground });
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    console.log(id, campground)
    res.send('it worked')
    //res.render('campgrounds/edit', { campground });
})

app.put('/campgrounds/:id', async (req, res) => {
    res.send('it worked')
})
app.listen(3000, () => {
    console.log('Listening!!!')
})