import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import registerRoute from './routes/registerRoute';
import loginRoute from './routes/loginRoute';

export const app = express();

app.use(cors());
app.use(express.json());

// ROUTES

app.use(registerRoute);
app.use(loginRoute)

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

