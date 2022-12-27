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

io.on("connection", (socket) => {
  let playerIndex = -1
  for (const i in connections) {
    if (connections[i] === null) {
      playerIndex = i
      break
    }
  }
  socket.emit("player-number", playerIndex)
  console.log(`player ${playerIndex}  is connected!`)
  if (playerIndex === -1) return
  connections[playerIndex] = false

  socket.broadcast.emit("player-connection", playerIndex)

  server.on("disconnect", () => {
    console.log(`player ${playerIndex}  is disconnect!`)
    connections[playerIndex] = null
    socket.broadcast.emit("player-connection", playerIndex)
  })
  socket.on("player-ready", () => {
    socket.broadcast.emit("enemy-ready", playerIndex)
    connections[playerIndex] = true
  })
  socket.on("check-players", () => {
    const players = []
    for (const i in connections) {
      connections[i] === null
        ? players.push({ connected: false, ready: false })
        : players.push({ connected: true, ready: connections[i] })
    }
    socket.emit("check-players", players)
  })
})
