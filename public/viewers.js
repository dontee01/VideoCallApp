// Remote peer code
// import Peer from 'peerjs';

const socket = io('/');
var peer = new Peer({
	host: '192.168.1.192',
	port: location.port || (location.protocol === 'https:' ? 443 : 80),
	path: '/peerjs'
});

let myVideoStream;
let myId;
let hostPeerId;
let conn = null;
const peerConnections = {};

socket.on('VRRRHOSTID', (id) => {
    hostPeerId = id;
    console.log('RRRHOSTID', id);
    
    console.log('HOSTPEERID', hostPeerId);
    // Connect to the host peer and receive the media stream
    // let conn = peer.connect(hostPeerId);
    // console.dir(conn);
    // conn.on('data', (stream) => {
    //     console.log('DATA RCVD');
    //     // Render the stream on a video element
    //     const video = document.createElement('video');
    //     video.srcObject = stream;
    //     video.play();
    //     document.body.appendChild(video);
    // });
    
    if (hostPeerId) {
        let video = document.getElementById('remoteVid');

        peer.on('call', mediaConnection => {
            // There's no need to add stream param here for viewers
            mediaConnection.answer();
            
            console.log('CALL OBJ', mediaConnection);

            video = document.getElementById('remoteVid');
            
            // listen for stream event from host
            mediaConnection.on('stream', remoteVideoStream => {
                video.srcObject = remoteVideoStream;
                video.play();
            });
        });

        peer.on('error', (err) => {
            console.dir(err);
            alert(err.type);
        });
    }
});

socket.on('totalViewers', (data) => {
    let viewersTxt = document.getElementById('totalViewers');
    viewersTxt.textContent = data;
});

peer.on('open', (id) => {
    console.log(`Remote peer ID: ${id}`);

    myId = id;
    // send Remote Peer ID to host peer to establish communications and send stream
    socket.emit("newUser" , id , roomID);

});

peer.on('error' , (err)=>{
  alert(err.type);
});

// listen for noHost to know whether the host has connected and ready to broadcast
// this has been handled by checking if hostPeerId exists
socket.on('noHost' , () => {
    console.log('Host Disconnected: Wait for Host to resume streaming!');
    // peerConnections[id] = call;,
});

socket.on('userDisconnect' , id=>{
    console.log('USER DISCONNECTED')
    if(peerConnections[id]){
        // peerConnections[id].close();
    }
});

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}