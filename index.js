// Base asteria sistema preguntes
// Aquesta base integra les diverses llibreries i sistemes que s'han d'emprar:
//  * UDP (dgram): Permet la comunicació entre el servidor i el client Arduino 
//  * Express: permet crear un servidor HTTP per a tirar la GUI
//  * Socket.io: permet la comunicació fluïda entre el servidor i la GUI
//  * mongo.js: permet connexio a la base de dades

// Creem el servidor express, que hosteja la web, en un port http
const express = require('express')
const app = express()
const server = require('http').createServer(app)

// // Creem la connexió amb la BBDD de mongo
// const mongojs = require('mongojs')
// const db = mongojs('mongodb://...', ['collection'])

// Creem el socket UDP4 per a comunicar-nos amb l'arduino 
const dgram = require('dgram')
const udpSocket = dgram.createSocket('udp4')

// creem un websocket que escolti directament dins el servidor HTTP
const io = require('socket.io').listen(server)

// Creem un espai per al socket, que ens permetrà comunicar-nos amb la web. 
const canvas = io.of('/canvas')

// vinculem l'entorn gràfic a la ruta http '/video', 
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