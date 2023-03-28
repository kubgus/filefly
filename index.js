const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 2023;
const server = require('http').createServer(app).listen(port, () => {
    console.log(`Server started on port ${port}!`);
});
const io = require('socket.io')(server, {
    maxHttpBufferSize: 1e9,
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render("pages/index");
});

app.get('/:socketId', (req, res) => {
    res.render("pages/index");
});

io.on("connection", (socket) => {

    let short = makeId(6);
    socket.join(short);

    // stc - server to client
    // cts - client to server

    socket.emit("stc-id", short);

    socket.on("cts-req-files", id => {
        io.to(id.toLowerCase()).emit("stc-req-files", socket.id);
    });

    socket.on("cts-res-files", (id, filename, batch) => {
        io.to(id).emit("stc-res-files", filename, batch);
    });
});

function makeId(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result.toLowerCase();
}