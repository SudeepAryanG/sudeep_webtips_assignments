console.log("server connected")
var express=require('express');
var app = express();
var http=require('http');
var server = http.createServer(app);
var io=require('socket.io')(server);
// const io=require('socket.io')(8080)
let users={}
port=8080;
app.use(express.static('public'))

io.on('connection',function (socket){
    socket.on('new-user',name=>{
        users[socket.id]=name;
        socket.broadcast.emit('user-connected', name)
    })
    // socket.emit('chat-message','SudeepAryan')
    socket.on('send-chat-message',message =>{
        socket.broadcast.emit('chat-message',{message: message,name: users[socket.id]})
    })
    socket.on('disconnect',name=>{
        socket.broadcast.emit('user-disconnected',users[socket.id])
        delete users[socket.id]
        
    })
})
server.listen(port)