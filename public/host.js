// Host side code
// import { Peer } from './peerjs';
// import Peer from 'peerjs';

// const peer = new Peer();
const socket = io('/host');

var peer = new Peer({
	host: '192.168.1.192',
	port: location.port || (location.protocol === 'https:' ? 443 : 80),
	path: '/peerjs'
})

let myVideoStream;
let myId;
let peerConnections = [];
let peerConnection = {};
let peerConnectionIds = [];

// peer.on('open', (id) => {
//   console.log(`Host peer ID: ${id}`);
  
//   myId = id;
// //   socket.emit("newUser" , id , roomID);
//   socket.emit("hostId" , id , roomID);

//   // Access the device camera and get the stream
//   navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true
//   })
//   .then((stream) => {
//     // For every new connection from remote peers, send the stream
//     peer.on('connection', (conn) => {
//       conn.on('open', () => {
//         conn.send(stream);
//       });
//     });
//   })
//   .catch((err) => {
//     console.error(err);
//   });
// });


peer.on('open' , (id)=>{
    myId = id;
    //   socket.emit("newUser" , id , roomID);
    console.log('MYID: ', myId);
    socket.emit("hostId" , id , roomID);

    // socket.on('viewerJoined', (resp) => {
    //     console.log("new user joined", resp.id)
    //     console.log("NEW socket joined", resp.sid)

    //     // peerConnections[socket.id] = id;
    //     // store socket id(sid) from viewer in an array
    //     peerConnectionIds.push(resp.sid);
    //     const socketId = resp.sid;
    //     peerConnection[socketId] = {'socketId': resp.sid, 'peerId': resp.id};
    //     // console.dir(peerConnection);
    //     // console.dir(Object.keys(peerConnection).length);
    //     console.dir(peerConnectionIds);
    // });

    
  // Access the device camera and get the stream
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  })
  .then((stream) => {

    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();
    document.body.appendChild(video);
    console.log('INSTREAM');

    // For every new connection from remote peers, send the stream
    // peer.on('connection', (conn) => {
    //     console.log('PEEROBJ', peer);
    //     console.log('CONNREMOTEPEERID', conn.peer);
    //     // conn.answer(stream);
    //   conn.on('open', () => {
    //     console.log('CONOPEN', conn);
    // //     // conn.addStream(stream);
    //     // const call = peer.call(conn.peer, stream);
    //     conn.send(stream);
    // //     const call = peer.call(conn, stream);
    //   });
    // });

    // listen for new socket connection
    socket.on('viewerJoined', (resp) => {
        console.log("new user joined", resp.id)
        console.log("NEW socket joined", resp.sid)

        // peerConnections[socket.id] = id;
        // store socket id(sid) from viewer in an array
        peerConnectionIds.push(resp.sid);
        const socketId = resp.sid;
        peerConnection[socketId] = {'socketId': resp.sid, 'peerId': resp.id};
        // console.dir(peerConnection);
        // console.dir(Object.keys(peerConnection).length);
        console.dir(peerConnectionIds);

        let mediaConnection = peer.call(resp.id, stream);
        mediaConnection.on('error', (err) => {
            console.log('MEDIACON_ERR');
        });
    });

    // peer.on('call', (mediaConnection) => {
    //     mediaConnection.answer(stream);
    
    //     // mediaConnection.on('stream', (remoteStream) => {
    
    //     // });
    // })

    
    // stream.getTracks().forEach(function(track) {
    //     track.on('data', function(chunk) {
    //         peer.send(chunk);
    //     });
    // });
  })
  .catch((err) => {
    console.error(err);
  });
})

peer.on('error' , (err)=>{
  alert(err.type);
});

socket.on('totalViewers', (data) => {
    let viewersTxt = document.getElementById('totalViewers');
    viewersTxt.textContent = data;
});

// socket.on('userJoined' , id=>{
//   console.log("new user joined")

//   peerConnections[id] = id;
// })
console.dir(peerConnection);

socket.on('userDisconnect' , (id)=>{
    console.log('USER DISCONNECTED', id)
    console.log('SOCKET DISCONNECTED', socket.id)
  if(peerConnection[id]){
    delete peerConnection[id];
    const index = peerConnectionIds.indexOf(id);
    console.log('INDEX SOCK', index);
    if (index > -1) { // only splice array when item is found
        peerConnectionIds.splice(index, 1); // 2nd parameter means remove one item only
    }
    // peerConnections[id].close();
  }
})