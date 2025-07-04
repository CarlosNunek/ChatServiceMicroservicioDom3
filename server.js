require('dotenv').config()
const WebSocket = require('ws')
const { handleConnection } = require('./controllers/chatController')

const wss = new WebSocket.Server({ port: process.env.PORT }, () => {
  console.log(`🟢 WebSocket activo en puerto ${process.env.PORT}`)
})

wss.on('connection', (ws) => {
  console.log('💬 Cliente conectado')
  handleConnection(ws)
})

