const axios = require('axios')
const { procesarMensaje, registrarCliente, desconectarCliente } = require('../services/chatService')

async function validarCedula(cedula) {
  try {
    // Intentar validar como recluso
    const reclusoRes = await axios.get(`http://localhost:5000/api/reclusos/${cedula}`)
    if (reclusoRes.status === 200) {
      return { tipo: 'recluso', valido: true }
    }
  } catch (err) {}

  try {
    // Intentar validar como familiar
    const famRes = await axios.get(`http://localhost:3001/api/familiares/validar/${cedula}`)
    if (famRes.status === 200) {
      return { tipo: 'familiar', valido: true }
    }
  } catch (err) {}

  return { valido: false }
}

function handleConnection(ws) {
  let cedula = null

  ws.on('message', async (data) => {
    const mensaje = JSON.parse(data)

    if (mensaje.tipo === 'autenticacion') {
      const resultado = await validarCedula(mensaje.cedula)

      if (!resultado.valido) {
        ws.send(JSON.stringify({ error: 'Cédula no válida. Conexión rechazada.' }))
        return ws.close()
      }

      cedula = mensaje.cedula
      registrarCliente(cedula, ws)
      console.log(`📲 Usuario autenticado: ${cedula} como ${resultado.tipo}`)
      ws.send(JSON.stringify({ tipo: 'autenticado', cedula }))
    }

    if (mensaje.tipo === 'mensaje') {
      procesarMensaje(mensaje)
    }
  })

  ws.on('close', () => {
    desconectarCliente(cedula)
  })
}

module.exports = { handleConnection }
