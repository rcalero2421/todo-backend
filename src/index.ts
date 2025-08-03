import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from '@interfaces/routes';
import { swaggerSpec } from '@docs';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
