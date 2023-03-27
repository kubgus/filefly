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

io.on("connection", (socket) => {

    // stc - server to client
    // cts - client to server

    socket.emit("stc-id", socket.id);

    socket.on("cts-req-files", socketId => {
        io.to(socketId).emit("stc-req-files", socket.id);
    });

    socket.on("cts-res-files", (socketId, files) => {
        io.to(socketId).emit("stc-res-files", files);
    })
});