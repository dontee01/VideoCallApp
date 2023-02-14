// Remote peer code
// import Peer from 'peerjs';

const socket = io('/');
var peer = new Peer({
	host: location.hostname,
	port: location.port || (location.protocol === 'https:' ? 443 : 80),
	path: '/peerjs'
})

// const peer = new Peer();

let myVideoStream;
let myId;
let hostPeerId;
const peerConnections = {}

// socket.on('RRRHOSTID', (id) => {
//     console.log('RRRHOSTID', id);
// });

// socket.on('broadcastId', (id) => {
//     hostPeerId = id;
//     console.log('VIEWER-HOSTID: '+id);
// });

peer.on('open', (id) => {
  console.log(`Remote peer ID: ${id}`);
  
  myId = id;
  socket.emit("newUser" , id , roomID);
  
    socket.on('VRRRHOSTID', (id) => {
        hostPeerId = id;
        console.log('RRRHOSTID', id);
        
        console.log('PEERID', hostPeerId);
        // Connect to the host peer and receive the media stream
        let conn = peer.connect(hostPeerId);
        conn.on('data', (stream) => {
            console.log('DATA RCVD');
            // Render the stream on a video element
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            document.body.appendChild(video);
        });
    });

});

peer.on('error' , (err)=>{
  alert(err.type);
});
socket.on('noHost' , () => {
    console.log('Host Disconnected: Wait for Host to resume streaming!');
    // peerConnections[id] = call;,
});

socket.on('userDisconnect' , id=>{
    console.log('USER DISCONNECTED')
    if(peerConnections[id]){
        // peerConnections[id].close();
    }
})