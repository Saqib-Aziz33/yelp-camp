const express = require(`express`);
const app = express();
const path = require(`path`);
const mongoose = require(`mongoose`);
const Campground = require(`./models/campground`);
const methodOverride = require(`method-override`);
const ejsMate = require(`ejs-mate`);
const expressLayouts = require(`express-ejs-layouts`);



//connection
mongoose.connect(`mongodb://localhost:27017/yelp-camp`, {
    useNewUrlParser: true,
    //useCreateIndex: true, option not supported
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on(`error`, console.error.bind(console, `connection error: `));
db.once(`open`, () => {
    console.log(`database connected`);
});



//views and public and middlewares
//app.engine(`ejs`, ejsMate); this package is not working correctly alternate ejs-express-layouts
app.set(`view engine`, `ejs`);
app.set(`views`, path.join(__dirname, `views`));
app.set(`layout`, `layouts/layout`);
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, `public`)));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride(`_method`));



//routing
app.get(`/`, (req, res) => {
    res.render(`index`);
});
app.get(`/campgrounds`, async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render(`campgrounds/index`, {campgrounds});
});
//creat
app.get(`/campgrounds/new`, (req, res) => {
    res.render(`campgrounds/new`);
});
app.post(`/campgrounds`, async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});
//edit
app.get(`/campgrounds/:id/edit`, async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render(`campgrounds/edit`, {campground});
});
app.put(`/campgrounds/:id`, async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground.id}`);

});
//delete
app.delete(`/campgrounds/:id`, async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
})
//read
app.get(`/campgrounds/:id`, async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render(`campgrounds/show`, {campground});
});

app.listen(3000, () => {
    console.log(`running at http://localhost:3000`);
})