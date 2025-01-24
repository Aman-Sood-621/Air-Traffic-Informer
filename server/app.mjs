import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import flight from './routers/flight.mjs';
import aircraftRouter from './routers/aircraftRouter.mjs';
import airportRouter from './routers/airportRouter.mjs';
import { fileURLToPath } from 'url';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import compression from 'compression';

// Swagger part
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for flight application',
    version: '1.0.0',
  }, servers: [
    {
      url: '/api', 
      description: 'Local server'
    }
  ]
};
const options = {
  swaggerDefinition,
  apis: ['./server/routers/*.mjs'],
};
const swaggerSpec = swaggerJSDoc(options);
// End of swagger part

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(compression());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use('/api', flight);
app.use('/api', aircraftRouter);
app.use('/api', airportRouter);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found'});
});

export default app;
