import express from 'express';
import routes from './routes';
import cors from 'cors';
import { apiErrorMiddleware } from './middleware/apiError.middleware';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

app.use('/api', routes);

app.use(apiErrorMiddleware);

export { app };