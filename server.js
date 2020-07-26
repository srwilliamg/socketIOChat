const express = require("express");
const path = require("path");
const chalk = require("chalk");
const app = express();

var httpServer = require('http').createServer(app);
var io = require('socket.io')(httpServer);

const portServer = process.env.PORT_SERVER || 4000;
const publicDirectory = path.join(__dirname, "public");

app.use(express.static(publicDirectory));

let users = {};

const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
 
const getRandomName = () => uniqueNamesGenerator({
  dictionaries: [adjectives, animals, colors],
  separator: ' ',
  length: 2,
  style: 'capital'
}); 

io.on('connect', (socket) => {
    // Socket -> the one user connected
    // io -> All users connected

    socket.on('connected', () => {
        socket.username = getRandomName();
        users[socket.username] = 'ok';
        socket.emit('updateUsers',users, socket.username);
        socket.broadcast.emit('updateUsers',users);
    });

    socket.on('sendMessage', (message) => {
        console.log(chalk.green(`New message message has arrived: '${message}'`));
        socket.broadcast.emit('getMessage',message);
    });

    socket.on('disconnect', () => {
        delete users[socket.username];
        io.emit('updateUsers', users);
    });
});

app.get('/', function (req, res) {
    res.render('index');
})

httpServer.listen(portServer, () => console.log(chalk.blueBright.inverse.bold(`Server socket running on port ${portServer}`)));