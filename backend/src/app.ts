import 'dotenv/config';
import express from 'express';
import routes from './routes';
import cors from 'cors';
import { apiErrorMiddleware } from './middleware/apiError.middleware';
import { globalLimiter } from './utils/requestLimit.util';

const app = express();

app.set('trust proxy', 1);

app.use(globalLimiter);

app.use(cors({
  origin: process.env['FRONTEND_BASE_URL']
}));

app.use(express.json());

app.use('/api', routes);

app.use(apiErrorMiddleware);

export { app };