const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 4000;
const {v4:uuidv4} = require('uuid');
const {ExpressPeerServer} = require('peer')
const peer = ExpressPeerServer(server , {
  debug:true
});

const customGenerationFunction = () => (Math.random().toString(36) + '0000000000000000000').substr(2, 4);

app.use('/peerjs', peer);
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.get('/' , (req,res)=>{
  // res.send(uuidv4());
  res.send(`/${customGenerationFunction()}`)
});
app.get('/' , (req,res)=>{
    res.render('index' );
});

app.get('/host/:room' , (req,res)=>{
	// res.send('Hello from A!');
    res.render('host' , {RoomId:req.params.room} );
});

app.get('/viewers/:room' , (req,res)=>{
    res.render('viewers' , {RoomId:req.params.room});
});

let hostId = '';
let hostRoom = '';
let totalViewers = 0;

var host = io.of('/host');
host.on("connection" , (socket)=>{
	socket.on('hostId', (id) => {
		hostId = id;
		viewers.emit('HRRRHOSTID', id);
	});

	socket.on('disconnect' , (id)=>{
		io.emit('userDisconnect' , id);
		// socket.to(hostRoom).broadcast.emit('userDisconnect' , id);
	})
});

var viewers = io.of('/');
viewers.on("connection" , (socket)=>{
  socket.on('newUser' , (id , room)=>{
	if (!hostId) {
		socket.emit('noHost', 'No stream yet');
	} else {
		// socket.join(room);
		// socket.to(room).broadcast.emit('userJoined' , id);
		
		hostRoom = room;
		console.log('HOSTROOM', hostRoom);
		console.log('SOCKETID', socket.id);
		viewers.emit('VRRRHOSTID', hostId);
		
		viewers.emit('viewerJoined' , id);
		host.emit('viewerJoined' , {'id':id, 'sid':socket.id});

		socket.join(hostRoom);
		// socket.to(hostRoom).broadcast.emit('userJoined' , id);
		totalViewers += 1;

		viewers.emit('totalViewers', totalViewers);
		host.emit('totalViewers', totalViewers);
	}
    // socket.on('disconnect' , ()=>{
    //     socket.to(hostRoom).broadcast.emit('userDisconnect' , id);
    // })
  })
  
	socket.on('disconnect' , ()=>{
		viewers.emit('userDisconnect' , socket.id);
		console.log('SOCKETdiscon', socket.id);
		host.emit('userDisconnect' , socket.id);
		// socket.to(hostRoom).broadcast.emit('userDisconnect' , id);
	})
  
  socket.on('hostId' , (id , room)=>{
	hostId = id;
	hostRoom = room;
    socket.join(hostRoom);

	socket.emit('broadcastId', id);
	io.emit('HOSTID_IO', id);
	console.log('HOSTID: '+id);
	console.log('ROOMID:', hostRoom);

	
  })
})
server.listen(port , ()=>{
  console.log("Server running on port : " + port);
})
