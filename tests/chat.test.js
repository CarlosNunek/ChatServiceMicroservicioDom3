const WebSocket = require('ws');
const { spawn } = require('child_process');

describe('WebSocket Chat Service', () => {
  let ws;
  let serverProcess;
  const PORT = 4000;

  beforeAll((done) => {
    // Ejecutar server.js con una variable de entorno definida
    serverProcess = spawn('node', ['server.js'], {
      env: { ...process.env, PORT: PORT.toString() },
      stdio: ['ignore', 'pipe', 'pipe'], // capturar stdout y stderr
    });

    // Mostrar logs del servidor para depuración
    serverProcess.stdout.on('data', (data) => {
      const msg = data.toString();
      console.log('[server]', msg);
      if (msg.includes('WebSocket activo')) {
        ws = new WebSocket(`ws://localhost:${PORT}`);
        ws.on('open', () => done());
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error('[server-error]', data.toString());
    });

    serverProcess.on('error', (err) => {
      console.error('[server-failed-to-start]', err);
    });
  }, 15000); // aumenta el timeout

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
