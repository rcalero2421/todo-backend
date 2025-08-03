import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from '@interfaces/routes';
import { swaggerSpec } from '@docs';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

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

describe('App Initialization', () => {
  it('GET / should return Todo API message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Todo API is running');
  });

  it('GET /docs should return Swagger HTML', async () => {
    const res = await request(app).get('/docs/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Swagger UI');
  });
});
