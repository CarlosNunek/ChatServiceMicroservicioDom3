describe('Validación de cédula (mock)', () => {
  const axios = require('axios');
  const chatController = require('../controllers/chatController');
  const { handleConnection } = chatController;

  jest.mock('axios');

  test('Debe rechazar una cédula inválida simulando peticiones fallidas', async () => {
    // Simula que axios GET falla para recluso y familiar
    axios.get.mockRejectedValueOnce(new Error('Recluso no encontrado'));
    axios.get.mockRejectedValueOnce(new Error('Familiar no encontrado'));

    const resultado = await chatController.validarCedula('0000000000');

    expect(resultado).toEqual({ valido: false });
  });
});
