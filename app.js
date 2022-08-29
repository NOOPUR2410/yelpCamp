const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session')
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const User = require('./models/user');

const passport = require('passport');
const localStrategy = require('passport-local');


const userRoutes = require('./routes/users');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelpCamp', {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
    //useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'this is confiddential',
    resave: false,
    saveUninitialized: true,
    cookies: {
        httpOnly: true,
        //  expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        //maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    if (!['/', '/login'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    next();
})

//app.get('/fakeUser', async (req, res) => {
//  const user = new User({ email: 'minnu@gmail.com', username: 'minnu' });
//const newUser = await User.register(user, 'chicken');
//res.send(newUser);
//})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes)


app.get('/', (req, res) => {
    res.render('home')
})



//app.get('/makecampground', async (req, res) => {
//  const camp = new Campground({ tittle: 'My Garden', description: 'Beautiful Flowers' });
//await camp.save();
//res.render('home')
//res.send(camp)
//})


app.all('*', (res, req, next) => {
    next(new ExpressError('page Not Found', 404))
})
app.use((err, req, res, next) => {
    //const { statusCode = 500, message = 'ERROR!!' } = err;
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'something went wrong';
    res.status(statusCode).render('error', { err });

})

app.listen(3000, () => {
    console.log('Listening!!!')
})