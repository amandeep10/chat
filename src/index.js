const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const badWords = require('bad-words');

const app = express();

// express does this behind the scenes, we need server object for socketio
const server = http.createServer(app);

//instance of socketio, need server object.
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicDir = path.join(__dirname, '../public');
console.log(publicDir);

app.use(express.static(publicDir));

// app.get('/', (req, res) => {
//     res.send('heeello');
// })


io.on('connection', (socket) => {
    console.log('connection established');
    //to a particular client
    socket.emit('message', "Hello User, how you doing");
    
    //to all clients except the user who triggered that event.
    socket.broadcast.emit('message','A new user joined');
    socket.on("sendMessage", (message, callack) => {

        const filter = new badWords();
        if (filter.isProfane(message)) {
            return callack('Bad words not allowd');
        }

        console.log(`message received ${message}`);
        socket.broadcast.emit('message', message);
        callack();
        //socket.emit('message', message);
        // to all clients
        //io.emit('message', message);   
    });

    socket.on('disconnect', () => {
        io.emit('message','A user has left');
    });

    socket.on('sendLocation', (objLoc, callback) => {
        let mapUrl = `https://google.com/maps?q=${objLoc.lat},${objLoc.lng}`;
        io.emit('message', { mapUrl });

        callback();
    })
})

server.listen(port, () => {
    console.log(`Server started at port ${port}`);
})