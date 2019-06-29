const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).send();
  console.log('Servidor rodando na porta: 3001');
});

app.listen(3001);
