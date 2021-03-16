import express from 'express';
import cors from 'cors';
import {
  hotlineRoutes,
  shelterRoutes,
  articleRoutes,
  userRoutes,
} from './routes';
import connectToDatabase from './utils/database';
import errorHandlerMiddleware from './utils/errorHandler';

const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./assets/swagger.json');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO refactor authRoutes - split controller logic
const authRoutes = require('./routes/auth');

app.use('/api', authRoutes);
app.use('/api', shelterRoutes);
app.use('/api', hotlineRoutes);
app.use('/api', userRoutes);
app.use('/api', articleRoutes);

app.get('/api', (req, res) => {
  res.send('Welcome to the "Pool" project API');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandlerMiddleware);

const startServer = async () => {
  try {
    await connectToDatabase();
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}/api`);
    });
  } catch (e) {
    console.error(e);
  }
};

startServer();
