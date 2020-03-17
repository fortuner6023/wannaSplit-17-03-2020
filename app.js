var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var http = require('http');
const mongoose = require('mongoose');
var chat = require("./controllers/chat");
var message = require("./models/message.js");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
const port = 3000
var app = express();
require('./routes.js')(app);


var uri = 'mongodb+srv://fortuner6023:OcqrPgFQVE1gPrrp@cluster0-pg5bs.mongodb.net/wannaSplit-24-02-2020?retryWrites=true&w=majority';
// var uri = 'mongodb://127.0.0.1:27017/wannaSplit';

mongoose.connection.openUri(uri, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, function(err, res) {
    if (err) {
        console.log('Error connecting to: ' + uri + '. ' + err);
    } else {
        console.log('Connected to: ' + uri);
    }
});



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);



var httpServer = http.createServer(app).listen(port, function() {
    console.log('Node app is listening on port.. ' + port);
});

io = require('socket.io')(httpServer);


io.on("connection", function(socket) {
    console.log('a user connected');

    socket.on('history', (data) => {
        console.log('socket', socket.connected)

        // socket.join(data.room);
        var query = {
            roomid: data.roomid
        }

        message.find(query, function(err, data) {
            if (err) {
                console.log(err)
                var value = {
                    "status": "Failure",
                    "message": "No Rooms Found",
                    "data": ""
                }
                io.in(socket.id).emit('historyFromSocket', value);

            }
            if (data) {

                var result = data.map(msg => ({
                    _id: msg.sender,
                    roomid: msg.roomid,
                    text: msg.text,
                    user: {
                        _id: msg.receiver
                    }
                }));

                var value = {
                    "status": "Success",
                    "message": "Chat fetched successfully",
                    "messages": result
                }


                io.in(socket.id).emit('historyFromSocket', value);

            }
        })

    });


    socket.on("socketFromClient", function(msg) {

        if (msg.roomid != undefined || msg.roomid != "") {
            socket.join(msg.roomid);
        }

        if (msg.methodName && msg.methodName == "chat") {
            chat.save_message(msg, function(err, data) {
                if (err) {
                    return socket.emit('responseFromServer', err);
                }
                if (data) {

                    if (data.messages.roomid != undefined || data.messages.roomid != "") {
                        socket.join(data.messages.roomid);
                    }
                    console.log('data===>', data)
                    io.in(data.messages.roomid).emit('responseFromServer', data);
                }
            });
        }
        //--------------------------------------------chat working -----------------------------

    });

    socket.on('disconnect', function(socket) {

        console.log('a user disconnected');
    })
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;


// //?================================================================

// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var http = require('http');
// const mongoose = require('mongoose');
// var chat = require("./controllers/chat");
// var message = require("./models/message.js");
// var Room = require("./models/rooms.js");
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/user');
// const port = 3000
// var app = express();​
// require('./routes.js')(app);​​​
// var uri = 'mongodb://127.0.0.1:27017/wannaSplit';
// mongoose.connection.openUri(uri, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, function(err, res) {
//     if (err) {
//         console.log('Error connecting to: ' + uri + '. ' + err);
//     } else {
//         console.log('Connected to: ' + uri);
//     }
// });​​​
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));​
// app.use('/', indexRouter);​​​
// var httpServer = http.createServer(app).listen(port, function() {
//     console.log('Node app is listening on port.. ' + port);
// });​
// io = require('socket.io')(httpServer);​​
// io.on("connection", function(socket) {
//     console.log('a user connected');​
//     socket.on('find_room', (data) => {​
//         Room.findOne({
//             $or: [
//                 { $and: [{ user_id1: data.from }, { user_id2: data.to }] },
//                 { $and: [{ user_id2: data.from }, { user_id1: data.to }] }
//             ]
//         }, function(err, data) {
//             if (err) {
//                 console.log(err)
//                 var value = {
//                     "status": "Failure",
//                     "message": "Internal DB Error",
//                     "data": ""
//                 }
//                 io.in(socket.id).emit('findRoomSocket', value);

//             }
//             if (data) {​
//                 socket.join(data._id);

//                 var value = {​
//                     "status": "Success",
//                     "message": "Room found successfully",
//                     "data": data​
//                 }
//                 io.in(socket.id).emit('findRoomSocket', value);

//             } else {​
//                 const newRoom = new Room({

//                     _id: new mongoose.Types.ObjectId(),
//                     user_id1: data.from,
//                     user_id2: data.to,

//                 });


//                 newRoom.save(function(err, data) {
//                     if (err) {

//                         var value = {
//                             "status": "Failure",
//                             "message": "Internal DB Error",
//                             "data": ""
//                         }
//                         io.in(socket.id).emit('findRoomSocket', value);

//                     }
//                     if (data) {

//                         socket.join(data._id);
//                         var value = {​
//                             "status": "Success",
//                             "message": "Room created successfully",
//                             "data": data​
//                         }
//                         io.in(socket.id).emit('findRoomSocket', value);


//                     }

//                 });
//             }
//         })
//     });​​
//     socket.on('history', (data) => {
//         // console.log('socket',socket.connected)
//         ​
//         // socket.join(data.room);
//         var query = {
//             roomid: data.roomid
//         }

//         message.find(query, function(err, data) {
//             if (err) {
//                 console.log(err)
//                 var value = {
//                     "status": "Failure",
//                     "message": "Internal DB Error",
//                     "data": ""
//                 }
//                 io.in(socket.id).emit('historyFromSocket', value);

//             }
//             if (data) {​
//                 var result = data.map(msg => ({
//                     _id: msg.sender,
//                     roomid: msg.roomid,
//                     text: msg.text,
//                     user: {
//                         _id: msg.receiver
//                     }
//                 }));

//                 var value = {​
//                     "status": "Success",
//                     "message": "Chat fetched successfully",
//                     "data": result​
//                 }
//                 io.in(socket.id).emit('historyFromSocket', value);

//             }
//         })​
//     });​
//     socket.on("socketFromClient", function(msg) {​
//         if (msg.roomid != undefined || msg.roomid != "") {
//             socket.join(msg.roomid);
//         }

//         if (msg.methodName && msg.methodName == "chat") {
//             chat.save_message(msg, function(err, data) {
//                 if (err) {
//                     return socket.emit('responseFromServer', err);
//                 }
//                 if (data) {​
//                     if (data.data.roomid != undefined || data.data.roomid != "") {
//                         socket.join(data.data.roomid);
//                     }
//                     console.log('data', data)
//                     io.in(data.data.roomid).emit('responseFromServer', data);
//                 }
//             });
//         }
//         //--------------------------------------------chat working -----------------------------
//         ​
//     });​
//     socket.on('disconnect', function(socket) {​
//         console.log('a user disconnected');
//     })
// });​​​​
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
// });​
// // error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};​
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });​
// module.exports = app;