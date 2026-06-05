import { app } from './app';

process.on('uncaughtException', (error) => {
  console.error(error);
});

process.on('unhandledRejection', (reason) => {
  console.error(reason);
});

app.listen(3333, () => {
  console.log('Servidor rodando na porta 3333');
});