const WebSocket = require('ws');

describe('WebSocket Chat Service', () => {
  let ws;

  beforeAll((done) => {
    ws = new WebSocket(`ws://localhost:${process.env.PORT}`);
    ws.on('open', () => done());
  });

  afterAll(() => {
    ws.close();
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
