
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelpCamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    //const c = new Campground({ title: 'green field' });
    //await c.save();
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 6000) + 100;
        const camp = new Campground({
            author: "630720699c50b6534190e833",
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251/20*20',
            description: 'Camping, forest, campfire, food over fire, coffee, mist, woods, sunsets, lakes, leaves and trees',
            price
        })
        await camp.save();
    }

}
seedDB().then(() => {
    mongoose.connection.close()
})


