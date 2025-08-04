import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import router from '@interfaces/routes';
import { swaggerSpec } from '@docs';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
  }),
);
app.use(express.json());
app.use('/api', router);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (_req, res) => {
  res.send('Todo API is running');
});

export default app;
