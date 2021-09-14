// Basic parameters
const peerConnections = {};

const config = { 
    iceServers: [
        { urls: ["stun:stun.l.google.com:19302"] }
    ] 
};

const constraints = {
    audio: { 
        echoCancellation: true, 
        noiseSuppression: true 
    },
    video: { 
        width: { exact: 1920 },
        height: { exact: 1080 },
        frameRate: { ideal: 30, max: 60 },
    }
};

const socket = io.connect(window.location.origin);
// -------------------------------------------------------------------------
// List Meida Devices
/*
navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
        devices.forEach(function(device) {
            console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
        });
})
*/
// -------------------------------------------------------------------------
let videostream;
navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        videostream = stream;
        socket.emit("broadcaster");
    })
    .catch(error => console.error(error));
// -------------------------------------------------------------------------
// Create a RTCPeerConnection
socket.on("watcher", id => {
    const peerConnection = new RTCPeerConnection(config);
    peerConnections[id] = peerConnection;

    let stream = videostream;
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    // event is called when receive an ICE candidate, and then send it to the server
    peerConnection.onicecandidate = event => {
        if (event.candidate) { socket.emit("candidate", id, event.candidate); }
    }
    peerConnection.createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => { socket.emit("offer", id, peerConnection.localDescription); });
});

socket.on("answer", (id, description) => { peerConnections[id].setRemoteDescription(description); });

socket.on("candidate", (id, candidate) => { peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate)); });

socket.on("disconnectPeer", id => {
    peerConnections[id].close();
    delete peerConnections[id];
});

window.onunload = window.onbeforeunload = () => { 
    socket.close(); 
}