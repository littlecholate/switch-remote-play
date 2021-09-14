const http = require("http");
const express = require("express");
const aws = require('aws-sdk');
const awsIot = require('aws-iot-device-sdk');

const port = process.env.PORT || 8000;

const app = express();

app.use(express.static("public"));
app.use(express.text())

const server = http.createServer(app);

const io = require("socket.io")(server);
// -------------------------------------------------------------------------
// aws init
const device = awsIot.device({
    keyPath: "", // private key path
    certPath: "", // certificate path
    caPath: "", // rootCA certificate path
    clientId: "", // unique client identifier
    host: "" // custom endpoint
});
// -------------------------------------------------------------------------
// connection for the clients and broadcaster to the server
let broadcaster

io.sockets.on("error", e => console.log(e));

io.sockets.on("connection", socket => {
    socket.on("broadcaster", () => {
        broadcaster = socket.id;
        socket.broadcast.emit("broadcaster");
    });
    socket.on("watcher", () => {
        socket.to(broadcaster).emit("watcher", socket.id);
    });
    socket.on("offer", (id, message) => {
        socket.to(id).emit("offer", socket.id, message);
    });
    socket.on("answer", (id, message) => {
        socket.to(id).emit("answer", socket.id, message);
    });
    socket.on("disconnect", () => {
        socket.to(broadcaster).emit("disconnectPeer", socket.id);
    });
    socket.on("candidate", (id, message) => {
        socket.to(id).emit("candidate", socket.id, message);
    });
});
// -------------------------------------------------------------------------
// routing configuration
app.post("/post-command-api", (req, res) => {
    //console.log(req.body)
    device.publish('KeyboardCommand', JSON.stringify({ key: req.body }));
    res.status(200).send()
});

server.listen(port, () => console.log(`Server is running on port ${port}`));