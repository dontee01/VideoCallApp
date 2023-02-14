// Host side code
// import { Peer } from './peerjs';
// import Peer from 'peerjs';

// const peer = new Peer();
const socket = io('/');

var peer = new Peer({
	host: location.hostname,
	port: location.port || (location.protocol === 'https:' ? 443 : 80),
	path: '/peerjs'
})

let myVideoStream;
let myId;
const peerConnections = {}

peer.on('open', (id) => {
  console.log(`Host peer ID: ${id}`);
  
  myId = id;
//   socket.emit("newUser" , id , roomID);
  socket.emit("hostId" , id , roomID);

  // Access the device camera and get the stream
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  })
  .then((stream) => {
    // For every new connection from remote peers, send the stream
    peer.on('connection', (conn) => {
      conn.on('open', () => {
        conn.send(stream);
      });
    });
  })
  .catch((err) => {
    console.error(err);
  });
});


// peer.on('open' , (id)=>{
//   myId = id;
// //   socket.emit("newUser" , id , roomID);
//   socket.emit("HostId" , id , roomID);
// })
peer.on('error' , (err)=>{
  alert(err.type);
});

socket.on('userJoined' , id=>{
  console.log("new user joined")
//   const call  = peer.call(id , myVideoStream);
//   const vid = document.createElement('video');
//   call.on('error' , (err)=>{
//     alert(err);
//   })
//   call.on('stream' , userStream=>{
//     addVideo(vid , userStream);
//   })
//   call.on('close' , ()=>{
//     vid.remove();
//     console.log("user disconect")
//   })
  peerConnections[id] = id;
})

socket.on('userDisconnect' , id=>{
  if(peerConnections[id]){
    peerConnections[id].close();
  }
})