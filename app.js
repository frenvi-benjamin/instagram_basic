require("dotenv").config()
const express = require("express")
const app = express()

const path = require("path")

// add body parser to read post body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// mongoose imports
const mongoose = require("mongoose")
mongoose.set("returnOriginal", false)
mongoose.set("debug", true)
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// helper module
const helper = require("./modules/helper")

helper.getUser("eatleryforfuture")
.then(user => {
    if (!user) throw Error("Application needs the eatleryforfuture account in DB to run properly")
})

// session
const session = require("express-session")

// use mongodb as session store
const MongoStore = require("connect-mongo")

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_CONNECTION_URL,
        }),
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 14 } // 14 days
    })
)


// set view engine to ejs
app.set("view engine", "ejs")
const ejs = require("ejs")

// set all paths
app.use("/img", express.static(path.join(__dirname, "/static/img")))
app.use("/js", express.static(path.join(__dirname, "/static/js")))
app.use("/css", express.static(path.join(__dirname, "/static/css")))

app.use("/qr-scanner", express.static(path.join(__dirname, "/node_modules/qr-scanner")))
app.use("/bootstrap", express.static(path.join(__dirname, "/node_modules/bootstrap/dist")))
app.use("/bootstrap-social", express.static(path.join(__dirname, "/node_modules/bootstrap-social")))
app.use("/jquery", express.static(path.join(__dirname, "/node_modules/jquery/dist")))
app.use("/fontawesome", express.static(path.join(__dirname, "/node_modules/@fortawesome/fontawesome-free")))

const startServer = app.listen(process.env.PORT, () => {
    console.log(`App listening at ${process.env.HOST}:${process.env.PORT}`)
})

// connect to database
mongoose.connect(process.env.MONGODB_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
// start server when db is connected
.then(() => startServer)
.catch((err) => console.log(err))


// index
app.use("/", require("./routes/index"))

// admin
app.use("/admin", require("./routes/admin"))

// auth
app.use("/auth", require("./routes/auth"))

// collab
app.use("/collab", require("./routes/collab"))

//scanner
app.use("/scanner", require("./routes/scanner"))