const express = require("express")
const mongoose  = require("mongoose")
const Router = require("./routes/routes")
const bodyParser = require('body-parser');

const app = express()
const Port = 3000

const dbURL = 'mongodb+srv://list_user:user123@cluster0.f88bnq0.mongodb.net/SubBase?retryWrites=true&w=majority'
mongoose.connect(dbURL)
    .then((result) =>{
        app.listen(Port)
        console.log("server started")
    })
    .catch((e) => console.log(e))

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    res.render('index')
})

app.use("/", Router)
