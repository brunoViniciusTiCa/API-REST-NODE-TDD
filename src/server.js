/** Importando o arquivo app que é onde está toda aplicação, middlewares e todo resto. */
const app = require('./app');

/** setanto a porta que será usada na aplicação. */
const port = 3001;

/** usando o app e em seguida iniciando o servidor e mandando estutar. */
app.listen(process.env.PORT || port, function(){
  console.log('Servidor Rodando Na Porta: ' + port);
});
