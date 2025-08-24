const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para leer JSON
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.send('¡Hola mundo desde Express!');
});

// Otra ruta de ejemplo
app.get('/saludo/:nombre', (req, res) => {
  const { nombre } = req.params;
  res.send(`Hola, ${nombre}!`);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
