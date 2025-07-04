const redis = require('redis')
const { publicarEvento } = require('../events/publisher')

const clienteRedis = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
})
clienteRedis.connect()

const clientesConectados = {}  // { cedula: ws }

function registrarCliente(cedula, ws) {
  clientesConectados[cedula] = ws
}

function desconectarCliente(cedula) {
  delete clientesConectados[cedula]
}

async function procesarMensaje({ de, para, contenido }) {
  const evento = {
    tipo: 'mensaje_enviado',
    de,
    para,
    contenido,
    timestamp: new Date().toISOString()
  }

  // Guardar temporal en Redis
  await clienteRedis.rPush(`mensajes:${para}`, JSON.stringify(evento))

  // Publicar evento
  await publicarEvento('chat-eventos', evento)

  // Enviar si está conectado
  if (clientesConectados[para]) {
    clientesConectados[para].send(JSON.stringify({
      tipo: 'mensaje_recibido',
      de,
      contenido
    }))
  }
}

module.exports = { registrarCliente, desconectarCliente, procesarMensaje }
