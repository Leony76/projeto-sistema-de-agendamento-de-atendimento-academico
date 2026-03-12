import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import registerRoute from './routes/POST/registerRoute';
import loginRoute from './routes/POST/loginRoute';
import userDataRoute from './routes/GET/userDataRoute';
import registerStudentRoute from './routes/POST/registerStudentRoute';
import registeredStudentsRoute from './routes/GET/registeredStudentsRoute';
import registeredStudentsTodayRoute from './routes/GET/registeredStudentsTodayRoute';
import updateStudentInfosRoute from './routes/PUT/updateStudentInfosRoute';

export const app = express();

app.use(cors());
app.use(express.json());

// ROUTES

app.use(registerRoute);
app.use(loginRoute);
app.use(userDataRoute);
app.use(registerStudentRoute);
app.use(registeredStudentsRoute);
app.use(registeredStudentsTodayRoute);
app.use(updateStudentInfosRoute);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

