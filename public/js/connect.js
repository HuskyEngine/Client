$(() => {
  var script = document.createElement('script');
  script.onload = () => {
    main();
  }
  script.src = (window.location.pathname === "/" ? "" : window.location.pathname) + 'socket.io/socket.io.js';
  document.body.appendChild(script);
});

function main() {
  var socket = io({path: window.location.pathname + 'socket.io'});
  var opts = {peerOpts: {initiator: true, config: { iceServers: [ { url: 'stun:stun.l.google.com:19302' } ] }, trickle: true}, autoUpgrade: true}
  let hash = null;
  var p2psocket = new P2P(socket, opts);
};
