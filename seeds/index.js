const mongoose = require(`mongoose`);
const Campground = require(`../models/campground`);
const cities = require(`./cities`);
const { places, descriptors } = require('./seedHelpers');

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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    //await (await Campground.deleteMany({}));
    for(let i = 0; i < 50; i++){
        const randPrice = Math.floor(Math.random() * 500) + 20;
        const rand = Math.floor(Math.random() * 1000);
        const camps = new Campground({
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/600x400/?camp,campground',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora omnis dolorem ducimus iste ipsa debitis culpa.',
            price: randPrice,
            author: '616a830970174f4e93a52ab7'
        })
        await camps.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close();
})