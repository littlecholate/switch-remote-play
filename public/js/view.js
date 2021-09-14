// only create one peer connection to the current broadcaster, don't send the media back
let peerConnection;

const config = { 
    iceServers: [
        { urls: ["stun:stun.l.google.com:19302"] }
    ] 
};

const socket = io.connect(window.location.origin);
// -------------------------------------------------------------------------
// create RTCPeerConnection and get the video stream from the broadcaster
const video = document.querySelector("video");

socket.on("offer", (id, description) => {
    peerConnection = new RTCPeerConnection(config);
    peerConnection.setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => { socket.emit("answer", id, peerConnection.localDescription); });

    peerConnection.ontrack = event => { video.srcObject = event.streams[0]; };
    peerConnection.onicecandidate = event => {
        if (event.candidate) { socket.emit("candidate", id, event.candidate); }
    };
});
// -------------------------------------------------------------------------
// other lifecycle functions
socket.on("candidate", (id, candidate) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error(e));
});

socket.on("connect", () => { socket.emit("watcher"); });

socket.on("broadcaster", () => { socket.emit("watcher"); });

window.onunload = window.onbeforeunload = () => {
    socket.close();
    peerConnection.close();
};
