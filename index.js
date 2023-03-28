const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 2023;
const server = require('http').createServer(app).listen(port, () => {
    console.log(`Server started on port ${port}!`);
});
const io = require('socket.io')(server);

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

let socketIds = {};
io.on("connection", (socket) => {

    const short = makeId(8);
    socketIds[short] = socket.id;

    // stc - server to client
    // cts - client to server

    socket.emit("stc-id", short);

    socket.on("cts-req-files", rShort => {
        io.to(socketIds[rShort]).emit("stc-req-files", socket.id);
    });

    socket.on("cts-res-files", (socketId, files) => {
        io.to(socketId).emit("stc-res-files", files);
    })

    socket.on("disconnect", () => {
        delete socketIds[short];
    })
});

function makeId(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}