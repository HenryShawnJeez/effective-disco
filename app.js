const express = require('express');
const ejs = require('ejs');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
// const helmet = require('helmet')



const rootRoute = require('./routes/rootRoute.route');
const notFoundRoute = require('./routes/notfound.route')
const { PORT } = require('./config')

const app = express();



// configurations
app.set("view engine", "ejs");
// app.use(helmet({
//     contentSecurityPolicy: false,
//     frameguard: false
// }))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(express.static("public"));
app.use('/', rootRoute);
app.use('*', notFoundRoute)

// so that mongoose no go disturb my ear with deprecation warning
mongoose.set('strictQuery', true)


// connecting to mongoose

mongoose.connect(process.env.URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
    .then(() => console.log("Database connected successfully"))
    .catch((error) => console.error("Something went wrong while connecting to database: " + error))





app.listen(PORT, function () {
    console.log(`Server listening on http://127.0.0.1:${PORT}`);
})


// var session = require('express-session');

