// Mock del módulo redis completo
jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn(),
    publish: jest.fn(),
  })),
}));

const axios = require('axios');
const chatController = require('../controllers/chatController');

jest.mock('axios');

describe('Validación de cédula (mock)', () => {
  test('Debe rechazar una cédula inválida simulando peticiones fallidas', async () => {
    axios.get.mockRejectedValueOnce(new Error('Recluso no encontrado'));
    axios.get.mockRejectedValueOnce(new Error('Familiar no encontrado'));

    const resultado = await chatController.validarCedula('0000000000');

    expect(resultado).toEqual({ valido: false });
  });
});
