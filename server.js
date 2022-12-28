const express = require("express")
const path = require("path")
const http = require("http")
const PORT = process.env.PORT || 4001
const socket = require("socket.io")
const app = express()
const server = http.createServer(app)
const io = socket(server)
app.use(express.static(path.join(__dirname, "public")))
server.listen(PORT, () => {
  console.log("server is running")
})
const connections = [null, null]
//si tenemos un jugador conectado por cada coneccion si hay espacio para otro jugador metelo a la sala lo inicializamos en -1 para que no se conecte a ninguna sala
io.on("connection", (socket) => {
  let playerIndex = -1
  for (const i in connections) {
    if (connections[i] === null) {
      playerIndex = i
      break
    }
  }
  //le damos el numero de jugador
  socket.emit("player-number", playerIndex)
  console.log(`player ${playerIndex}  is connected!`)
  if (playerIndex === -1) return
  connections[playerIndex] = false
  //le decimos al otro jugador que se conecto un nuevo jugador
  socket.broadcast.emit("player-connection", playerIndex)
  // si el jugador se desconecta
  server.on("disconnect", () => {
    console.log(`player ${playerIndex}  is disconnect!`)
    connections[playerIndex] = null
    socket.broadcast.emit("player-connection", playerIndex)
  })
  //si el jugador esta listo
  socket.on("player-ready", () => {
    socket.broadcast.emit("enemy-ready", playerIndex)
    connections[playerIndex] = true
  })
  //si no esta listo y no esta conectado  ponlo en false pero si esta conectado ponlo en true y agregalo a la sala
  socket.on("check-players", () => {
    const players = []
    for (const i in connections) {
      connections[i] === null
        ? players.push({ connected: false, ready: false })
        : players.push({ connected: true, ready: connections[i] })
    }
    socket.emit("check-players", players)
  })
  //el jugador disparo lo registramos en la consola y lo enviamos al otro jugador
  socket.on("fire", (id) => {
    console.log(`Shot fired from ${playerIndex}`, id)
    socket.broadcast.emit("fire", id)
  })
  //reqistramos a que cuadro le dispararon y lo enviamos al otro jugador
  socket.on("fire-reply", (square) => {
    console.log(square)
    socket.broadcast.emit("fire-reply", square)
  })
  //si este tiempo se cumple, y no se ha disparado, se envia un mensaje de timeout y se desconecta del juego
  setTimeout(() => {
    connections[playerIndex] = null
    socket.emit("timeout")
    socket.disconnect()
  }, 60000)
})
