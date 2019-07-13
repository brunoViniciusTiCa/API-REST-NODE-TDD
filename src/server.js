const app = require('./app');

const port = 3001;

app.listen(process.env.PORT || port, function(){
  console.log('Servidor Rodando Na Porta: ' + port);
});
