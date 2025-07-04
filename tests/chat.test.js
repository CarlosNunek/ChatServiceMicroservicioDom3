const WebSocket = require('ws');
const { spawn } = require('child_process');

describe('WebSocket Chat Service', () => {
  let ws;
  let serverProcess;
  const PORT = process.env.PORT || 4000;

  beforeAll((done) => {
    // Inicia el servidor.js como un proceso hijo
    serverProcess = spawn('node', ['server.js'], {
      env: { ...process.env, PORT: PORT.toString() },
    });

    // Espera un momento a que el servidor se levante
    setTimeout(() => {
      ws = new WebSocket(`ws://localhost:${PORT}`);
      ws.on('open', () => done());
    }, 1000); // espera 1 segundo
  }, 10000); // extiende timeout a 10s

  afterAll(() => {
    if (ws && ws.readyState === WebSocket.OPEN) ws.close();
    if (serverProcess) serverProcess.kill();
  });

  test('Debe rechazar una cédula inválida', (done) => {
    ws.send(JSON.stringify({ tipo: 'autenticacion', cedula: '0000000000' }));
    ws.on('message', (msg) => {
      const respuesta = JSON.parse(msg);
      expect(respuesta.error).toBe('Cédula no válida. Conexión rechazada.');
      done();
    });
  });
});
