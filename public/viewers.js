// Remote peer code
// import Peer from 'peerjs';

const socket = io('/');
var peer = new Peer({
	host: '192.168.1.192',
	port: location.port || (location.protocol === 'https:' ? 443 : 80),
	path: '/peerjs'
})

// const peer = new Peer();

let myVideoStream;
let myId;
let hostPeerId;
let conn = null;
const peerConnections = {}

// socket.on('RRRHOSTID', (id) => {
//     console.log('RRRHOSTID', id);
// });

// socket.on('broadcastId', (id) => {
//     hostPeerId = id;
//     console.log('VIEWER-HOSTID: '+id);
// });

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
    
    // let call = peer.call(hostPeerId);
    
        // const video = document.createElement('video')
    // call.on('stream', stream => {
    //     console.log('CALL RCVD');
    //     const video = document.createElement('video');
    //     video.srcObject = stream;
    //     video.play();
    //     document.body.appendChild(video);
    //     // addVideoStream(video, userVideoStream)
    // });
    
    if (hostPeerId) {
            let video = document.getElementById('remoteVid');
            // let video = document.createElement('video');
            // video.srcObject;
            // video.play();
            // document.body.appendChild(video);
        // let mediaConnection = peer.call(hostPeerId);

        peer.on('call', mediaConnection => {
            mediaConnection.answer();
            
            console.log('CALL OBJ', mediaConnection);

            video = document.getElementById('remoteVid');
            
            mediaConnection.on('stream', remoteVideoStream => {
                video.srcObject = remoteVideoStream;
                video.play();
            });
        });


        // peer.on('stream', (stream) => {
        //     video = document.getElementById('remoteVid');
        //     // video = document.createElement('video');
        //     video.srcObject = stream;
        //     video.play();
        //     // document.body.appendChild(video);
        // });

        peer.on('error', (err) => {
            console.dir(err);
            alert(err.type);
        });
    }
});

// conn.on('data', (stream) => {
//     console.log('DATA RCVD');
//     // Render the stream on a video element
//     const video = document.createElement('video');
//     video.srcObject = stream;
//     video.play();
//     document.body.appendChild(video);
// });

// peer.on('connection', function (c) {
//     // Allow only a single connection
//     if (conn && conn.open) {
//         c.on('open', function() {
//             c.send("Already connected to another client");
//             setTimeout(function() { c.close(); }, 500);
//         });
//         return;
//     }

//     conn = c;
//     console.log("Connected to: " + conn.peer);
// });

socket.on('totalViewers', (data) => {
    let viewersTxt = document.getElementById('totalViewers');
    viewersTxt.textContent = data;
});

peer.on('open', (id) => {
  console.log(`Remote peer ID: ${id}`);
  
  myId = id;
  socket.emit("newUser" , id , roomID);
  

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
});

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}