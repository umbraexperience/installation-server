// Umbra
// 2019 - 2020

/*
Servidor Node.JS de la visualització de les partícules
Utilitza les llibraries:
  - UDP (dgram): Per comunicar el servidor amb el client Arduino 
  - Express: Per crear un servidor HTTP per mostrar el contingut generat en temps real
  - P5.JS: Per generar el vídeo de les partícules interactives en temps real
  - Socket.io: Per generar una comunicació fluïda entre el servidor i la interfície

*/

// Creem el servidor express, que hosteja la web, en un port http
const express = require('express')
const app = express()
const server = require('http').createServer(app)

// Creem el socket UDP4 per a comunicar-nos amb l'arduino 
const dgram = require('dgram')
const udpSocket = dgram.createSocket('udp4')

// creem un websocket que escolti directament dins el servidor HTTP
const io = require('socket.io').listen(server)

// Creem un espai per al socket, que ens permetrà comunicar-nos amb la web. 
const canvas = io.of('/canvas')

// vinculem l'entorn gràfic a la ruta http '/canvas', 
app.use('/canvas', express.static('public/canvas'))

// Iniciem el servidor al port 8080, el comu per http. Iniciem a la ip 0.0.0.0 perquè hi pugui accedir qualsevol ordinador
server.listen(8080, '0.0.0.0')

// Esdeveniment per a captar errors en el socket UDP
udpSocket.on('error', err => {
  console.log(`udp error:\n${err.stack}`)
  udpSocket.close()
});

// Processament simple d'un missatge
udpSocket.on('message', (msg, rinfo) => {
  console.log(`udp got: ${msg} from ${rinfo.address}:${rinfo.port}`)
  let temp = parseInt(msg);
  canvas.emit('message', temp)
})

// Obertura del socket UDP
udpSocket.on('listening', () => {
  const address = udpSocket.address()
  console.log(`server listening ${address.address}:${address.port}`)
});

udpSocket.bind(33334);