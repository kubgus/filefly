const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 2023;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render("pages/index");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});